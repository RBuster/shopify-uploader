import { TextStyle, Card, ResourceList, Avatar, ResourceItem, OptionList, Heading, Button } from '@shopify/polaris';
import { FormatEngine } from '../lib/engines/formatEngine';
import CSVReader from 'react-csv-reader';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

class Uploader extends React.Component {
    options = [];
    showTooltip = false;
    state = {}
    formatEngine;
    defaultState = {
        newProducts: [],
        filteredProducts: [],
        newFileName: null,
        selected: [],
        showTooltip: false,
        isLoading: false
    };
    constructor(props) {
        super(props);
        this.state = this.defaultState;
        this.formatEngine = new FormatEngine();
    }

    cleanData(data, fileInfo) {
        if (data) {
            this.setState(
                {
                    isLoading: true
                }
            )
            const products = this.formatEngine.convertProducts(data);
            console.info(products);
            this.options = this.formatEngine.getFilterOptions(products);
            this.setState(
                {
                    newProducts: products,
                    filteredProducts: products,
                    newFileName: fileInfo.name,
                    isLoading: false
                }
            )
            console.info(this.state);
        }
    }

    setSelected(val) {
        if (Object.keys(val).length === 0) {
            this.setState({ selected: [] });
        }
        else {
            this.setState({ selected: val });
        }
        this.filterProducts(val);
    }

    filterProducts(options) {
        console.info(options);
        let currentProducts = this.state.newProducts.slice();
        options.forEach((option, index) => {
            let snapShot = currentProducts.slice();
            console.info(option);
            currentProducts = snapShot.filter((product) => {
                return product[option];
            });
            console.info(currentProducts);
        });

        this.setState({ filteredProducts: currentProducts });
    }

    setShow(show) {
        this.showTooltip = show;
    }

    clearFile() {
        //kinda annoying hack to clear out the input
        (document.getElementById('CSVReader')).value = '';
        this.setState(this.defaultState);
    }

    hasProducts() {
        return this.state.newProducts.length > 0;
    }

    render() {
        return (
            <div className="uploader">
                <AppStatus loading={this.state.isLoading} fileName={this.state.newFileName} />
                <Row hidden={this.hasProducts()}>
                    <Col className="col">
                        <Heading element="h2">Select CSV to upload...</Heading>
                        <CSVReader inputId='CSVReader' cssClass="react-csv-input" onFileLoaded={(data, fileInfo) => this.cleanData(data, fileInfo)} />
                    </Col>
                </Row>
                <Row className="justify-content-md-center" hidden={!this.hasProducts()}>
                    <Button variant="link" onClick={() => this.clearFile()}>Upload a different file</Button>
                </Row>
                <Row className="justify-content-md-center" hidden={!this.hasProducts()}>
                    <Col md="auto" className="select">
                        <Card>
                            <OptionList
                                title="Select Columns that need data"
                                onChange={(val) => this.setSelected(val)}
                                options={this.options}
                                selected={this.state.selected}
                                allowMultiple
                            />
                        </Card>
                    </Col>
                </Row>
                <Row hidden={!this.hasProducts()}>
                    <Col>
                        <div>
                            <TextStyle variation="strong">Total Item Count: {this.state.newProducts.length.toLocaleString()}</TextStyle>
                        </div>
                        <div hidden={!this.state.selected || this.state.selected.length <= 0}>
                            <TextStyle variation="strong">Filtered Item Count: {this.state.filteredProducts.length.toLocaleString()}</TextStyle>
                        </div>
                        <div>
                            <TextStyle variation="subdued">Sample items to be loaded (first 10)</TextStyle>
                        </div>
                        <ProductDisplay data={this.state.filteredProducts.slice(0, 10)} />
                    </Col>
                </Row>
            </div>
        );
    }
}
function AppStatus(props) {
    console.info(props);
    if (props.loading) {
        return LoadingFile();
    }
    else {
        return FileStatus(props);
    }
}

function NoFile(props) {
    return <Heading element="h1">Go ahead, start your upload.</Heading>;
}

function HasFile(props) {
    return <Heading element="h1">Current File: {props.fileName}</Heading>;
}

function FileStatus(props) {
    if (props.fileName) {
        return <HasFile fileName={props.fileName} />;
    }
    else {
        return <NoFile />;
    }
}

// function ProductDisplay(props) {
//     if (props.data && props.data.length > 0) {
//         console.info(props.data);
//         let first = props.data[0];
//         return <Table striped responsive hover size="sm">
//             <thead>
//                 <th>#</th>
//                 {Object.keys(first).map((key) => <th>{key}</th>)}
//             </thead>
//             <tbody>
//                 {
//                     props.data.map((product, index) => {
//                         return <tr>
//                             <td>{index + 1}</td>
//                             {
//                                 Object.values(product).map((val) => <td>{val}</td>)
//                             }
//                         </tr>;
//                     })
//                 }
//             </tbody>
//         </Table>;
//     }
//     return null;
// }

function ProductDisplay(props) {
    if (props.data && props.data.length > 0) {
        return <Card>
            <ResourceList
                resourceName={{ singular: 'product', plural: 'products' }}
                items={props.data}
                renderItem={(item) => {
                    const { title, upc, sku, description, imgURL } = item;
                    const media = <Avatar size="medium" name={title} source={imgURL || ''} />;
                    return (
                        <ResourceItem
                            id={upc}
                            //url={url}
                            media={media}
                            accessibilityLabel={`View details for ${title}`}
                        >
                            <h3>
                                <TextStyle variation="strong">{title}</TextStyle>
                            </h3>
                            <div dangerouslySetInnerHTML={{ __html: description }}></div>
                        </ResourceItem>
                    );
                }}
            />
        </Card>;
    }
    return null;
}

function LoadingFile() {
    return <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
    </div>;
}

export default Uploader;