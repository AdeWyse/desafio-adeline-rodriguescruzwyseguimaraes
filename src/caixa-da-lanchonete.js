class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        var outputString;
        var preco;

        const pagamentoDiferenciador =  this.decidirMetodoPagamento(metodoDePagamento);
        if(pagamentoDiferenciador != "Forma de pagamento inválida!"){
            if(itens.length > 0){
                var valorBase = this.decidirPedidos(itens);
    
                if(typeof valorBase == "string"){
                    return valorBase;
                }
                var valorFinal= valorBase + (valorBase * pagamentoDiferenciador);

                return "R$ " + valorFinal.toFixed(2).replace('.', ',');

            }else{
                if(itens.length == 0){
                    return "Não há itens no carrinho de compra!";
                }
            }
        }else{
            return pagamentoDiferenciador;
        }
    }
    //Retorna o valor para multiiplicar as taxas ou frase de aviso
    decidirMetodoPagamento(metodoDePagamento){
        var resultado;
        if(metodoDePagamento === "dinheiro"){
            resultado = -0.05;
        }else{
            if(metodoDePagamento === "debito"){
                resultado = 0;
            }else{
                if (metodoDePagamento === "credito") {
                    resultado = 0.03;
                } else {
                    resultado = "Forma de pagamento inválida!";
                }
            }
        }

        return resultado;
    }
    //Retorna o valor total da compra ou frase de aviso
    decidirPedidos(pedidosRaw){

        const pedidos = pedidosRaw.map(str => {
          const [codigo, quantidade] = str.split(',');
          return { codigo, quantidade: Number(quantidade) };
        });

        //Objetos feitos seguindo a tabela disponibilizada, o campo  descricao tem valores "principal" e "extra" para fazer a verificação segundo os requisitos
        const cardapio = [
            { codigo: "cafe", descricao: "principal cafe", valor: 3.00},
            { codigo: "chantily", descricao: "extra cafe", valor: 1.50},
            { codigo: "suco", descricao: "suco", valor: 6.20},
            { codigo: "sanduiche", descricao: "principal sanduiche", valor: 6.50},
            { codigo: "queijo", descricao: "extra sanduiche", valor: 2.00},
            { codigo: "salgado", descricao: "salgado", valor: 1.50},
            { codigo: "combo1", descricao: "combo1", valor: 9.50},
            { codigo: "combo2", descricao: "combo2", valor: 7.50},
          ];

          //Testa se existem pedidos com codigos que não estão no cardápio
            const codigosCardapio = cardapio.map(item => item.codigo);
            const listaPedidos = pedidos.every(pedido => codigosCardapio.includes(pedido.codigo));
            if (!listaPedidos) {
                return "Item inválido!";
            }

            var principalPedidos = []
            var valorAcumulado = 0;
            var quantidadeInvalida = 0;

            //Adiciona pedidos principais para checagem posterior e calcula valor de pedidos que não são extra
            pedidos.forEach(pedido => {
                cardapio.forEach(item => {
                    if(pedido.codigo === item.codigo){
                        if(item.descricao.includes("principal")){
                            principalPedidos.push(pedido.codigo);
                        }
                        if(!item.descricao.includes("extra")){
                            if(pedido.quantidade <= 0){
                                quantidadeInvalida++;
                            }
                            valorAcumulado += item.valor*pedido.quantidade;
                        }
                    }
                })
            });

            var valido = 1;

            //Checa se pedidos extra contem pedidos principais e adiciona valor de pedidos válidos
            pedidos.forEach(pedido => {
                cardapio.forEach(item => {
                    if(pedido.codigo === item.codigo){

                        if(item.descricao.includes("extra")){

                            const descricao = item.descricao.split(' ');
                            const extraTipo = descricao[descricao.length - 1];
                            
                            if(principalPedidos.includes(extraTipo)){
                                if(pedido.quantidade <= 0){
                                    quantidadeInvalida++;
                                }
                                valorAcumulado += item.valor*pedido.quantidade;
                            }else{
                                valido = "Item extra não pode ser pedido sem o principal";
                            }
                        }
                    }
                })
            });
            if(valido != 1){
                return valido;
            }
            if(quantidadeInvalida != 0){
                return  "Quantidade inválida!";
            }
            return valorAcumulado;
    }

    
}

export { CaixaDaLanchonete };
