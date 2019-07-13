import React, { forwardRef, memo } from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@material-ui/core'
import MaterialTable, { MaterialTableProps } from 'material-table'
import AddBox from '@material-ui/icons/AddBox'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'

const tableIcons = {
  // @ts-ignore
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  // @ts-ignore
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  // @ts-ignore
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  // @ts-ignore
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  // @ts-ignore
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  // @ts-ignore
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  // @ts-ignore
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  // @ts-ignore
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  // @ts-ignore
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  // @ts-ignore
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  // @ts-ignore
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  // @ts-ignore
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  // @ts-ignore
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  // @ts-ignore
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  // @ts-ignore
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  // @ts-ignore
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  // @ts-ignore
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

const LoadingWrapper = styled.div`
  display: table;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
`

const LoadingWrapperCell = styled.div`
  display: table-cell;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  text-align: center;
`

export const Table = memo(({ ...props }: MaterialTableProps) => (
  <MaterialTable
    {...props}
    components={{
      OverlayLoading: () => (
        <LoadingWrapper>
          <LoadingWrapperCell>
            <CircularProgress color="primary" />
          </LoadingWrapperCell>
        </LoadingWrapper>
      ),
    }}
    // @ts-ignore
    icons={tableIcons}
    localization={{
      pagination: {
        labelRowsSelect: 'items',
        labelDisplayedRows: '{from}-{to} de {count}',
        labelRowsPerPage: 'Items por página:',
        // @ts-ignore
        firstAriaLabel: 'Primeira página',
        firstTooltip: 'Primeira página',
        previousAriaLabel: 'Página anterior',
        previousTooltip: 'Página anterior',
        nextAriaLabel: 'Próxima página',
        nextTooltip: 'Próxima página',
        lastAriaLabel: 'Última página',
        lastTooltip: 'Última página',
      },
      header: {
        actions: 'Ações',
      },
      body: {
        emptyDataSourceMessage: 'Nenhum atendimento',
        filterRow: {
          filterTooltip: 'Filtro',
        },
        editRow: {
          deleteText: 'Você tem certeza que deseja remover este item?',
          cancelTooltip: 'Cancelar',
          saveTooltip: 'Salvar',
        },
        addTooltip: 'Adicionar',
        deleteTooltip: 'Remover',
        editTooltip: 'Editar',
      },
      toolbar: {
        addRemoveColumns: 'Adicionar ou remover colunas',
        nRowsSelected: '{0} item(s) selecionados',
        showColumnsTitle: 'Mostrar colunas',
        showColumnsAriaLabel: 'Mostrar colunas',
        exportTitle: 'Exportar',
        exportAriaLabel: 'Exportar',
        exportName: 'Exportar como CSV',
        searchTooltip: 'Buscar',
        searchPlaceholder: 'Buscar',
      },
    }}
  />
))
