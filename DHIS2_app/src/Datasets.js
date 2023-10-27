import React from "react";
import { useDataQuery } from '@dhis2/app-runtime'
import { Menu, MenuItem } from "@dhis2/ui";
import { useState } from "react";
import "./Datasets.css";

import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from '@dhis2/ui'

export function Datasets() {
    
    const request = {
        request0: {
          resource: "/dataSets",
          params: {
            fields: "id, displayName, created",
            paging: "false"
          }
        }
      }
      
    const sendRequest = () => {
          const { loading, error, data } = useDataQuery(request)
          const [table, setTable] = useState(null)

          if (error) {
              return <span>ERROR: {error.message}</span>
          }
      
          if (loading) {
              return <span>Loading...</span>
          }
      
          if (data) {
             console.log("API response:",data)
             //To-do: return a component using the data response 
             return (
                <div class ="datasets">
                  <h1>Datasets</h1>
                  <div class="content">
                  <Menu>
                      {data.request0.dataSets.map((res) => {
                        return (<MenuItem 
                          key={res.id}
                          label= {res.displayName}
                          onClick={() => {
                            setTable(res)
                          } }
                        />)
                      })}
                  </Menu>
                  {table &&
                    <div>
                      <Table>
                        <TableHead>
                          <TableRowHead>
                            <TableCellHead>Display Name</TableCellHead>
                            <TableCellHead>ID</TableCellHead>
                            <TableCellHead>Created</TableCellHead>
                          </TableRowHead>
                        </TableHead>
                        <TableRow key={table.id}>
                            <TableCell>{table.displayName}</TableCell>
                            <TableCell>{table.id}</TableCell>
                            <TableCell>{table.created}</TableCell>
                          </TableRow>
                      </Table>
                    </div>
                  } 
                  </div>
                </div>
              );
          }
      }

  return sendRequest();

}
