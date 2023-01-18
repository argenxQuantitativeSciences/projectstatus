import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "./App.css";
import projectstatus from "./projectstatus.json";
import InfoIcon from "@mui/icons-material/Info";

function App() {
  const columns = [
      { field: "id", headerName: "id", width: 100, hide: true },
      { field: "compound", headerName: "Compound", width: 75 },
      { field: "indication", headerName: "Inidcation", width: 90 },
      { field: "study", headerName: "Study", width: 100 },
      { field: "name", headerName: "Name", width: 200, hide: true },
      { field: "itemType", headerName: "itemType", width: 100, hide: true },
      {
        field: "isContainer",
        headerName: "isContainer",
        width: 100,
        hide: true,
      },
      {
        field: "description",
        headerName: "description",
        width: 100,
        hide: true,
      },
      { field: "version", headerName: "version", width: 100, hide: true },
      {
        field: "isVersioned",
        headerName: "isVersioned",
        width: 100,
        hide: true,
      },
      {
        field: "isCheckedOut",
        headerName: "isCheckedOut",
        width: 100,
        hide: true,
      },
      { field: "isLocked", headerName: "isLocked", width: 100, hide: true },
      {
        field: "signatureStatus",
        headerName: "signatureStatus",
        width: 100,
        hide: true,
      },
      { field: "size", headerName: "size", width: 60 },
      { field: "createdBy", headerName: "createdBy", width: 80 },
      {
        field: "created",
        headerName: "created",
        width: 170,
        type: "dateTime",
        valueFormatter: (params) =>
          new Date(params?.value).toLocaleString("sv", {
            timeZoneName: "short",
          }),
      },
      {
        field: "dateCreated",
        headerName: "dateCreated",
        width: 170,
        type: "dateTime",
        hide: true,
      },
      { field: "lastModifiedBy", headerName: "lastModifiedBy", width: 100 },
      {
        field: "lastModified",
        headerName: "lastModified",
        type: "dateTime",
        valueFormatter: (params) =>
          new Date(params?.value).toLocaleString("sv", {
            timeZoneName: "short",
          }),
        width: 170,
      },
      {
        field: "dateLastModified",
        headerName: "dateLastModified",
        type: "dateTime",
        width: 170,
        hide: true,
      },
      {
        field: "propertiesLastModifiedBy",
        headerName: "propertiesLastModifiedBy",
        width: 100,
        hide: true,
      },
      {
        field: "propertiesLastModified",
        headerName: "propertiesLastModified",
        type: "dateTime",
        width: 170,
        hide: true,
      },
      { field: "state", headerName: "state", width: 100, hide: true },
      { field: "path", headerName: "Path", width: 600 },
    ],
    [windowDimension, detectHW] = useState({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    }),
    detectSize = () => {
      detectHW({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
      });
    },
    { href } = window.location,
    [rows, setRows] = useState(null),
    [info, setInfo] = useState("No information is available."),
    modifyData = (rowData) => {
      rowData.forEach((row, i) => {
        row.id = i;
        row.compound = row.path.split("/")[2];
        row.indication = row.path.split("/")[3];
        row.study = row.path.split("/")[4];
        row.created = new Date(row.created);
        // row.dateCreated = Date.parse(row.dateCreated).toDateString();
        row.lastModified = new Date(row.lastModified);
        // row.dateLastModified = new Date(row.dateLastModified);
        // row.propertiesLastModified = new Date(row.propertiesLastModified);
        // row.size = Number(row.size).toLocaleString();
        // console.log(row);
      });
    };

  // TODO: also will need to schedule a job to run the code to build the JSON file
  // %lsaf_search( lsaf_name=projectstatus.html);
  // proc json out='c:/temp/projectstatus.json' pretty ;
  //    export lsafsearch ;
  // run ;

  useEffect(() => {
    if (href.startsWith("http://localhost")) {
      const tempRows = projectstatus["SASTableData+LSAFSEARCH"],
        tempInfo = projectstatus["SASTableData+INFO"];
      modifyData(tempRows);
      setRows(tempRows);
      setInfo(tempInfo[0].info);
      return; // if we are running locally then skip the loading of json file since we use another
    }
    const url =
      "https://xarprod.ondemand.sas.com/lsaf/filedownload/sdd%3A//" +
      "/general/biostat/tools/projectstatus/projectstatus.json";
    fetch(url).then(function (response) {
      response.json().then(function (response) {
        const tempRows = response["SASTableData+LSAFSEARCH"],
          tempInfo = projectstatus["SASTableData+INFO"];
        modifyData(tempRows);
        setRows(tempRows);
        setInfo(tempInfo[0].info);
      });
    });
  }, [href]);

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  return (
    <Box>
      <Container
        sx={{
          // height: windowDimension.winHeight,
          border: 2,
          m: 1,
          fontSize: "1.0em",
          maxHeight: windowDimension.winHeight - 30,
          minWidth: windowDimension.winWidth - 30,
          overflow: "auto",
        }}
      >
        <Typography
          sx={{ fontSize: 12, backgroundColor: "black", color: "white" }}
        >
          &nbsp; Click on a row to open the corresponding Project Status
          Dashboard
          <Tooltip title={info}>
            <IconButton
              sx={{ color: "yellow", ml: 3, p: 0.25 }}
              onClick={() => {}}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Typography>

        {rows && (
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={22}
            density="compact"
            sx={{
              height: windowDimension.winHeight - 75,
              fontWeight: "fontSize=5",
              fontSize: "0.7em",
              padding: 0,
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: "lastModified", sort: "desc" }],
              },
            }}
            onRowClick={(e) => {
              window.open(
                "https://xarprod.ondemand.sas.com/lsaf/filedownload/sdd%3A//" +
                  e.row.path,
                "_blank"
              );
            }}
          />
        )}
      </Container>
    </Box>
  );
}

export default App;
