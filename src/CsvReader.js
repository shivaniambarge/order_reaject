import { useState } from "react";

export default function CsvReader() {
    const [csvFile, setCsvFile] = useState();
    const [csvArray, setCsvArray] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])

    // Parse CSV File
    const processCSV = (str) => {
        // Create headers
        // 1,2,4,5 = [1,2,4,5,]
        const headers = str.slice(0, str.indexOf("\n")).split(",");
        // Create rows
        //["1,1011,560000,12/11/2019,Sugar:5;Onion:3;Carrot:9;Bread:9;","2,1011,560000,12/11/2019,Sugar:5;Onion:3;Carrot:9;Bread:9;"]
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
        // Handel \r in headers
        headers.forEach((element, index) => {
            headers[index] = element.trim().replace("\r", "");
        });
        // Convert rows in to array of object
        const newArray = rows.map((row) => {
            const values = row.split(",");
            const eachObject = headers.reduce((obj, header, i) => {
                obj[header] = values[i].trim();
                return obj;
            }, {});
            return eachObject;
        });
        // Set state of csv array
        setCsvArray(newArray);
        setSearchResult(newArray)
    };

    //Handle submit of CSV file
    const submit = () => {
        setSearch("");
        const file = csvFile;
        // Read file using FileReader Web Api ref: https://developer.mozilla.org/en-US/docs/Web/API/FileReader

        const reader = new FileReader();
        // Handle load event

        reader.onload = function ({ target }) {
            const text = target.result;
            // Process CSv File
            processCSV(text);
        };
        // Read file as a text
        reader.readAsText(file);
    };
    //Handle search
    const handelSearchChange = ({ target }) => {
        setSearch(target.value);
        // Filter csv array on basic of the search value
        let result = csvArray.filter(
            (item) =>
                // Compare delivery pincode with search value
                item.deliveryPincode
                    .toLowerCase()
                    .indexOf(target.value.toLowerCase()) !== -1 ||
                // Compare order date with search value
                item.orderDate.indexOf(target.value.toLowerCase()) !== -1
        );
        setSearchResult(result);
    };
    // Render Items 
    const itemRender = (item) => {
        // Replace ; with <br> in items
        const displayResult = item.items.replaceAll(";", "<br>");
        // Set display result as html
        return <p dangerouslySetInnerHTML={{ __html: displayResult }}></p>;
    };

    return (
        <form id="csv-form">
            {/* File upload input box */}
            <input
                type="file"
                accept=".csv"
                id="csvFile"
                onChange={(e) => {
                    setCsvFile(e.target.files[0]);
                }}
            ></input>
            <br />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    if (csvFile) submit();
                }}
            >
                Submit
            </button>
            <br />
            <br />
            {/* Search box Creation on the basic of the length of the CSV Array */}
            {(searchResult.length > 0 || search.length >0)&& (
                <input
                    value={search}
                    className="searchBox"
                    placeholder="Search via pincode or date"
                    onChange={handelSearchChange}
                />
            )}
            {/* Table Creation on the basic of the length of the CSV Array */}
            {searchResult.length > 0 && (
                <>
                    <table>
                        <thead>
                            <th>Order Id</th>
                            <th>Customer Id</th>
                            <th>Delivery Pincode</th>
                            <th>Order Date</th>
                            <th>Items</th>
                        </thead>
                        <tbody>
                            {/* Display CSV Array */}
                            {searchResult.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.orderId}</td>
                                    <td>{item.customerId}</td>
                                    <td>{item.deliveryPincode}</td>
                                    <td>{item.orderDate}</td>
                                    <td>{itemRender(item)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </form>
    );
}
