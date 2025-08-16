import { useState } from 'react';

export function Produto(props) {
        const [contador, setContador] = useState(0);

        const aumentar = () => setContador(contador + 1);
        const diminuir = () => setContador(contador > 0 ? contador - 1 : 0);

        const clickAumentar = () => {
            props.onButtonClick();
            aumentar();
        };

        const clickDiminuir = () => {
            props.onButtonClick();
            diminuir();
        };

        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'black' }}>{props.titulo}</h2>
                    <img src={props.imagem} alt={props.titulo} style={{ width: '200px', height: '200px', borderRadius: '20px', border: '5px solid #663b2b'}} />
                    <div style={{ marginTop: '10px' }}>
                        <span style={{ margin: '0 10px 0 0', color: '#56270B', fontSize: '20px', fontWeight: 'bold' }}>Qtd.</span>
                        <button onClick={clickDiminuir} style={{ borderRadius:'35px', width: '15px', backgroundColor:'#56270B'}}>-</button>
                        <span style={{ margin: '0 10px', color: 'black' }}>{contador}</span>
                        <button onClick={clickAumentar} style={{ borderRadius:'35px', width: '15px', backgroundColor:'#56270B'}}>+</button>
                    </div>
                </div>
            </div>
        );
}
