import { useState } from 'react';
import './Matriz.css';
import dcgs from '../disciplinasDCGs';

function Matriz({ curriculoKey, onSelecionarDisciplina }) {
    const [expandido, setExpandido] = useState({});

    const toggle = (titulo) => {
        setExpandido(prev => ({ ...prev, [titulo]: !prev[titulo] }));
    };

    const dadosCurriculos = {
        "2025": {
            "1º Semestre": [
                "Algoritmos e Programação A",
                "Eletricidade Básica",
                "Fundamentos da Computação",
                "Fundamentos da Matemática",
                "Introdução a Redes de Computadores",
                "Laboratório de Sistemas Operacionais",
            ],
            "2º Semestre": [
                "Algoritmos e Programação B",
                "Estatística Para Pesquisa",
                "Organização e Arquitetura de Computadores",
                "Pesquisa Aplicada",
                "Sistemas de Cabeamento Estruturado",
                "Tecnologia de Comunicação de Dados",
            ],
            "3º Semestre": [
                "Eletromagnetismo e Propagação",
                "Estrutura de Dados",
                "Grafos em Redes",
                "Interconexões de Redes",
                "Protocolos de Aplicação",
            ],
            "4º Semestre": [
                "Introdução à Segurança",
                "Redes Aplicadas a Telecomunicações",
                "Redes Sem Fio",
                "Sistemas Digitais",
                "Sistemas Operacionais",
                "Tecnologias Para Infraestruturas Virtualizadas",
            ],
            "5º Semestre": [
                "Governança de Tecnologia da Informação",
                "Projeto de Redes",
            ],
            "Qualquer Semestre": [...dcgs],
        },
        "2017": {
            "1º Semestre": [
                "Algoritmos e Programação A",
                "Eletricidade Básica",
                "Fundamentos da Computação",
                "Introdução a Redes de Computadores",
                "Relações Humanas e Diversidade",
            ],
            "2º Semestre": [
                "Algoritmos e Programação B",
                "Cálculo B",
                "Organização e Arquitetura de Computadores",
                "Pesquisa Aplicada",
                "Sistemas de Cabeamento Estruturado",
                "Tecnologia de Comunicação de Dados",
            ],
            "3º Semestre": [
                "Eletromagnetismo e Propagação",
                "Estatística",
                "Estrutura de Dados",
                "Organização e Arquitetura de Computadores",
                "Protocolos de Aplicação",
            ],
            "4º Semestre": [
                "Interconexões de Redes",
                "Redes Aplicadas a Telecomunicações",
                "Sistemas Digitais",
                "Sistemas Operacionais",
            ],
            "5º Semestre": [
                "Administração de Sistemas de Redes",
                "Gerenciamento de Infraestrutura de Ti",
                "Segurança em Redes de Computadores",
                "Sistemas Distribuídos",
                "Tecnologia de Redes Industriais",
            ],
            "6º Semestre": [
                "Governança de Tecnologia da Informação",
                "Projeto de Redes",
                "Redes Sem Fio",
            ],
            "Qualquer Semestre": [...dcgs],
        },
    };

    const curriculo = dadosCurriculos[curriculoKey];

    return (
        <div className="matriz-container">
            <h3 className="matriz-title">Currículo {curriculoKey}</h3>
            {Object.entries(curriculo).map(([semestre, disciplinas]) => (
                <div className="matriz-semestre-block" key={semestre}>
                    <button className="matriz-semestre-btn" onClick={() => toggle(semestre)}>{semestre}</button>
                    {expandido[semestre] && (
                        <ul className="matriz-disciplinas-list">
                            {disciplinas.map((disc, idx) => (
                                <li key={idx}>
                                    <button onClick={() => onSelecionarDisciplina(disc)}>
                                        {disc}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Matriz;