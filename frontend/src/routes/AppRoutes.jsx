import {Routes,Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// PAGES
import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import CadastroPage from '../pages/CadastroPage'

export default function AppRoutes (){
    return (
        <Routes>
            {/*  PAGINAS PUBLICAS */}
            <Route path='/' element = {<LandingPage/>}/> 
            <Route path='/login' element = {<Login/>}/>
            <Route path='/cadastro' element = {<CadastroPage/>}/>

            {/* ROTAS PROTEGIDAS */}
            <Route path='/aluno_exemplo' element = {
                <ProtectedRoute tipoPermitido= "ALUNO"> {/*PASSAR A PAGINA DO ALUNO AQUI COMO CHILD */} </ProtectedRoute>
            }/>
            <Route path='/aluno_exemplo' element = {
                <ProtectedRoute tipoPermitido= "PROFESSOR"> {/*PASSAR A PAGINA DO PROFESSOR AQUI COMO CHILD */} </ProtectedRoute>
            }/>
            <Route path='/aluno_exemplo' element = {
                <ProtectedRoute tipoPermitido= "EMPRESA_PARCEIRA"> {/*PASSAR A PAGINA DA EMPRESA AQUI COMO CHILD */} </ProtectedRoute>
            }/>

        </Routes>
    )
}