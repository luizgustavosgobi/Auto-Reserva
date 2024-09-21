import User from '@/utils/types/User';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import UserActions from './UserActions';
import './styles/UserTable.css';

const lightTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function createColumnDef(field: string, headerName: string, width: number, otherProps = {}): GridColDef {
    const matches = useMediaQuery('(max-width:450px)');

    return {
        field,
        headerName,
        width,
        headerAlign: 'center',
        align: 'center',
        flex: matches ? 0 : 1,
        ...otherProps,
    };
}

function UserTable(users: { [key: string]: User }) {
    useEffect(() => {
        const rowsInitial = Object.keys(users).map((key) => ({
            id: key,
            ...users[key],
        }));
        setRows(rowsInitial);
    }, [users]);

    const [rows, setRows] = useState<User[]>([]);
    const rowsState = { rows, setRows }

    const columns: GridColDef[] = [
        createColumnDef('photo', '', 80, {
            flex: 0,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <img src={params.value as string} style={{ width: '50px', height: '50px' }} />
                </div>
            ),
        }),
        createColumnDef('name', 'Name', 130),
        createColumnDef('prontuario', 'Identifier', 130),
        createColumnDef('email', 'Email', 130, {
            align: 'left',
            valueGetter: (value: GridCellParams) => (value ? value : 'No email registered'),
        }),
        createColumnDef('role', 'Role', 70),
        createColumnDef('accessCode', 'Access Code', 150, {
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        }),
        createColumnDef('_', 'Actions', 130, {
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell(params: GridCellParams) {
                const row = params.row as User
                return (
                    <UserActions
                        user={row}
                        rowsState={rowsState}
                    />
                );
            },
        }),
    ];

    return (
        <div className='userTable_container'>
            <ThemeProvider theme={lightTheme}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={65}

                    loading={Object.keys(users).length === 0}
                    localeText={{
                        noRowsLabel: 'no registered users',
                    }}

                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 20 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}

                    sx={{
                        border: 1,
                        borderColor: 'var(--color-purple-700)',
                        fontFamily: "'Poppins', sans-serif",
                    }}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }

                    disableRowSelectionOnClick
                    disableColumnSelector
                />
            </ThemeProvider>
        </div>
    )
}

export default UserTable;