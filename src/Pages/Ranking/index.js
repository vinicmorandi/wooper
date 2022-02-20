// React
import React, { useEffect } from "react";

// Material UI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography, CircularProgress } from '@mui/material';

// CSS
import "./ranking.css"

import { useMutation, gql } from "@apollo/client"

const usuariosElo_query = gql`
    mutation getElo{
        usuariosElo{
            nome
            elo
            vitorias
            derrotas
        }
    }
`

const Ranking = () => {
    // Define estados para a paginação
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [usuariosGQL] = useMutation(usuariosElo_query)
    const [rows, setRows] = React.useState('')

    // Título
    useEffect(() => {
        document.title = 'Ranking | Wooper'
        if (rows === "") {
            pegaInfoUsuario()
        }
    })

    const pegaInfoUsuario = async () => {
        const usuarios = await usuariosGQL()
        setRows(usuarios.data.usuariosElo)
    }

    return (
        <>
            <div id='headerRanking'>
                <Typography variant='h2' align='center' gutterBottom={true}>Ranking</Typography>
            </div>
            <Paper sx={{ width: '70%', margin: 'auto', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '70vh' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell key='usuario'>Usuário</TableCell>
                                <TableCell key='elo'>Elo</TableCell>
                                <TableCell key='vitorias'>Vitórias</TableCell>
                                <TableCell key='derrotas'>Derrotas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rows.length !== 0) ? rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={row.nome}>
                                            <TableCell key='usu'>{row.nome}</TableCell>
                                            <TableCell key='el'>{row.elo}</TableCell>
                                            <TableCell key='vit'>{row.vitorias}</TableCell>
                                            <TableCell key='der'>{row.derrotas}</TableCell>
                                        </TableRow>
                                    );
                                }) : <TableRow><TableCell colSpan={4}><CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='20px' color='inherit' /></TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}

export default Ranking