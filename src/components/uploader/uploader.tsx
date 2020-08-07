import * as React from 'react';
import '../uploader/uploader.css';
import CSVReader from 'react-csv-reader';
import MultiSelect from "react-multi-select-component";
import { FormatEngine } from '../../lib/engines/formatEngine';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { Option } from 'react-multi-select-component/dist/lib/interfaces';

export class Uploader extends React.Component {
    options: Array<Option> = [];
    showTooltip: boolean = false;
    state: any = {}
    formatEngine: FormatEngine;
    defaultState = {
        newProducts: [],
        filteredProducts: [],
        newFileName: null,
        selected: null,
        showTooltip: false,
        isLoading: false
    };
    constructor(props: any) {
        super(props);
        this.state = this.defaultState;
        this.formatEngine = new FormatEngine();
    }

    cleanData(data: Array<Array<string>>, fileInfo: any) {
        if (data) {
            this.setState(
                {
                    isLoading: true
                }
            )
            this.options = this.formatEngine.getFilterOptions(data);
            this.setState(
                {
                    newProducts: this.formatEngine.formatCSV(data),
                    filteredProducts: this.formatEngine.formatCSV(data),
                    newFileName: fileInfo.name,
                    isLoading: false
                }
            )
            console.info(this.state);
        }
    }

    setSelected(val: any) {
        this.setState({selected: val});
        this.filterProducts(val);
    }

    filterProducts(options: Option[]) {
        console.info(options);
        let currentProducts = this.state.newProducts.slice();
        options.forEach((option: any, index: number) => {
            let snapShot = currentProducts.slice();
            console.info(option.value);
            currentProducts = snapShot.filter((product: any) => {
                return product[option.value];
            });
            console.info(currentProducts);
        });

        this.setState({filteredProducts: currentProducts});
    }

    setShow(show: boolean) {
        this.showTooltip = show;
    }

    clearFile() {
        //kinda annoying hack to clear out the input
        (document.getElementById('CSVReader') as HTMLInputElement).value = '';
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
                        <label>Select CSV to upload...</label>
                        <CSVReader inputId='CSVReader' cssClass="react-csv-input" onFileLoaded={(data: Array<Array<string>>, fileInfo: any) => this.cleanData(data, fileInfo)} />
                    </Col>
                </Row>
                <Row className="justify-content-md-center" hidden={!this.hasProducts()}>
                    <Button variant="link" onClick={() => this.clearFile()}>Upload a different file</Button>
                </Row>
                <Row className="justify-content-md-center" hidden={!this.hasProducts()}>
                    <Col md="auto" className="select">
                        <label id="columnSelect">Select Columns to watch</label>&nbsp;
                        <OverlayTrigger
                            key={"right"}
                            placement={"right"}
                            overlay={
                                <Tooltip id={`tooltip-${"right"}`}>
                                    Select columns that must be populated for data to be imported. EX, if you have to have a title for a product, then select title and only products with titles will be uploaded
                                </Tooltip>}>
                            <Badge as="div" pill variant="info"><i>More info...</i></Badge>
                        </OverlayTrigger>
                        <MultiSelect
                            className="columnSelect"
                            options={this.options}
                            value={this.state.selected}
                            onChange={(val: any) => this.setSelected(val)}
                            labelledBy={"columnSelect"}
                            disabled={this.options.length <= 0}
                            hasSelectAll={this.options.length > 0}
                        />
                    </Col>
                </Row>
                <Row hidden={!this.hasProducts()}>
                    <Col>
                        <h2>Items to be loaded (first 10)</h2>
                        <ProductDisplay data={this.state.filteredProducts.slice(0, 10)} />
                    </Col>
                </Row>
            </div>
        );
    }
}
function AppStatus(props: any) {
    console.info(props);
    if (props.loading) {
        return LoadingFile();
    }
    else {
        return FileStatus(props);
    }
}

function NoFile(props: any) {
    return <h1>Go ahead, start your upload.</h1>;
}

function HasFile(props: any) {
    return <h1>Current File: <br /> {props.fileName}</h1>;
}

function FileStatus(props: any) {
    if (props.fileName) {
        return <HasFile fileName={props.fileName} />;
    }
    else {
        return <NoFile />;
    }
}

function ProductDisplay(props: any) {
    if (props.data && props.data.length > 0) {
        console.info(props.data);
        let first = props.data[0];
        return <Table striped>
            <thead>
                <th>#</th>
                {Object.keys(first).map((key: any) => <th>{key}</th>)}
            </thead>
            <tbody>
                {
                    props.data.map((product: any, index: number) => {
                        return <tr>
                            <td>{index + 1}</td>
                            {
                                Object.values(product).map((val: any) => <td>{val}</td>)
                            }
                        </tr>;
                    })
                }
            </tbody>
        </Table>;
    }
    return null;
}

function LoadingFile() {
    return <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
    </div>;
}