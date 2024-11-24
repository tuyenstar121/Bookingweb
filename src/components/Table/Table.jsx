import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";

function createData(customer, phoneNumber, tableNumber, status, restaurant) {
  return { customer, phoneNumber, tableNumber, status, restaurant };
}

const rows = [
  createData("Lasania Chiken Fri", "123456789", "Table 5", "Approved", "Restaurant A"),
  createData("Big Baza Bang", "987654321", "Table 2", "Pending", "Restaurant B"),
  createData("Mouth Freshner", "555666777", "Table 1", "Approved", "Restaurant A"),
  createData("Cupcake", "111222333", "Table 3", "Delivered", "Restaurant C"),
];

const makeStyle = (status) => {
  if (status === "Approved") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else if (status === "Pending") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else {
    return {
      background: "#59bfff",
      color: "white",
    };
  }
};

export default function BasicTable() {
  return (
    <div className="Table">
      <h3>Danh sách đặt bàn</h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Khách hàng</TableCell>
              <TableCell align="left">Số điện thoại</TableCell>
              <TableCell align="left">Số bàn</TableCell>

              <TableCell align="left">Trạng thái</TableCell>
              <TableCell align="left">Nhà hàng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {rows.map((row) => (
              <TableRow
                key={row.customer}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.customer}
                </TableCell>
                <TableCell align="left">{row.phoneNumber}</TableCell>
                <TableCell align="left">{row.tableNumber}</TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="left">{row.restaurant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
