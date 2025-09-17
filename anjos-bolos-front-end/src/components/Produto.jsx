import { useState } from 'react';

export function Produto(props) {
        const [contador, setContador] = useState(0);

        const aumentar = () => setContador(contador + 1);
        const diminuir = () => setContador(contador > 0 ? contador - 1 : 0);

        const clickAumentar = () => {
            if (props.tipo === "festa" && contador >= 1) {
                return;
            }
            props.onAdd();
            aumentar();
        };

        const clickDiminuir = () => {
            if (contador > 0) {
            props.onRemove();
            diminuir();
            }
        };

        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'black' }}>{props.titulo}</h2>
                    <img onClick={clickAumentar} src={props.imagem} alt={props.titulo} style={{ width: '200px', height: '200px', borderRadius: '20px', border: '5px solid #663b2b', cursor: 'pointer'}} />
                    <h2 style={{ color: '#56270B', marginTop:'0', marginBottom:'0' }}>R$ {props.valor}</h2>
                    <div style={{ marginTop: '10px', marginBottom: '0' }}>
                        <span style={{ margin: '0 10px 0 0', color: '#56270B', fontSize: '20px', fontWeight: 'bold' }}>Qtd.</span>
                        <button onClick={clickDiminuir} style={{ borderRadius:'35px', width: '15px', backgroundColor:'#56270B', padding: '8px 20px 8px 15px', fontWeight: 'bold'}}>-</button>
                        <span style={{ margin: '0 10px', color: 'black', fontSize: '24px', fontWeight: 'bold', paddingTop: '10px' }}>{contador}</span>
                        <button disabled={props.tipo === "festa" && contador >= 1} onClick={clickAumentar} style={{ borderRadius:'35px', width: '35px', backgroundColor:'#56270B', padding: '8px 20px 8px 12px', fontWeight: 'bold'}}>+</button>
                    </div>
                </div>
            </div>
        );
}
