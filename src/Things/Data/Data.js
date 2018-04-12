import React from 'react'
import Dropzone from 'react-dropzone'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import { readFile } from '../../Actions/actions'
import DataFlexColumnHeader from './DataFlexColumnHeader'

class Data extends React.Component {
  constructor () {
    super()

    this.state = {
      file: null
    }
  }

  toggleLoader () {
    this.setState({
      file: null
    })
  }

  handleDataDropSuccess (file) {
    const onDataUpload = this.props.onDataUpload

    this.setState({
      file: file[0]
    }, function () {
      onDataUpload(this.state.file)
    })
  }

  render () {
    const isLoaded = this.props.file.isLoaded
    let columns = this.props.data.columns ? this.props.data.columns : []
    let data = this.props.data

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

    return (
      <div id="data-container">
        <div
          className='things-label accordion'
          onClick={this.props.togglePanel.bind(this)}
        >
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="panel-collapse-svg relative dib pen relative v-top"><polyline points="10 18 16 12 10 6"></polyline></svg>
          Data
        </div>
        <div className="panel">
          <Dropzone onDrop={this.toggleLoader.bind(this)} style={{}} onDropAccepted={this.handleDataDropSuccess.bind(this)} disableClick={isLoaded}>
            <div id='data-drop-container'>
              {isLoaded ? (
                <ReactTable
                  id='data-table-container'
                  data={data}
                  columns={columns}
                  showPagination={false} />
                ) : (
                  <p id='data-drop-placeholder-text'>Drag your data here<br />or<br />Click to choose a file</p>
              )}

            </div>
          </Dropzone>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    data: state.drawing.data,
    file: state.file
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDataUpload: (file) => {
      dispatch(readFile(file))
    }
  }
}

Data = connect(mapStateToProps, mapDispatchToProps)(Data)

export default Data
