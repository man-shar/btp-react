import React from 'react';
import DataFlexColumnHeader from './DataFlexColumnHeader'
import AttributeName from '../AttributeEditor/AttributeName'
import { connect } from 'react-redux';

/*
if (isLoaded) {
  columns = columns.map((column) => {
    return {
      Header: () => {
        return (
          <DataFlexColumnHeader attributeId={"dataAttribute" + "$" + column} />
        );
      },
      accessor: column,
      sortable: false,
      resizable: false,
      filterable: false
    }
  })
  data = this.props.data
}
*/

class DataTable extends React.Component {
  render () {
    const data = this.props.data;
    const columns = data.columns;
    const drawing = this.props.drawing;
    const props = ["mean", "sum", "count", "max", "min"];

    return (
      <div id="data-table">
      {
        columns.map((column, i) => {
          return (
            <div className="column-flex-table" key={i}>
              <DataFlexColumnHeader attributeId={"dataAttribute" + "$" + column} />
              {
                props.map((prop, j) => {
                  const attributeId = "dataAttribute" + "$" + column + "$" + prop;
                  const attributeName = drawing["dataAttribute" + "$" + column + "$" + prop + "$name"];
                  if (!attributeName)
                    return;
                  return (
                    <AttributeName  attributeId={attributeId} attributeName={attributeName}/>
                  );
                })
              }
            </div>
          );
        })
      }

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing
  }
}

DataTable = connect(mapStateToProps)(DataTable);

export default DataTable;
