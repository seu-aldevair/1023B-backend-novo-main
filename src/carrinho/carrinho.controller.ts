import { Request, Response } from "express";
import { ObjectId } from "bson";
import { db } from "../database/banco-mongo.js";

interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}

interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

class CarrinhoController {
    //adicionarItem
    async adicionarItem(req: Request, res: Response) {
        console.log("Chegou na rota de adicionar item ao carrinho");
        const { usuarioId, produtoId, quantidade } = req.body;

        // Buscar o produto no banco de dados
        const produto = await db.collection("produtos").findOne({ _id: ObjectId.createFromHexString(produtoId) });
        if (!produto) {
            return res.status(400).json({ message: "Produto não encontrado" });
        }

        // Pegar o preço do produto
        const precoUnitario = produto.preco;
        // Pegar o nome do produto
        const nome = produto.nome;

        // Verificar se um carrinho com o usuário já existe
        let carrinho = await db.collection("carrinhos").findOne({ usuarioId });

        const novoItem: ItemCarrinho = {
            produtoId,
            quantidade,
            precoUnitario,
            nome
        };

        if (!carrinho) {
            // Se não existir deve criar um novo carrinho
            const novoCarrinho: Carrinho = {
                usuarioId,
                itens: [novoItem],
                dataAtualizacao: new Date(),
                total: precoUnitario * quantidade
            };
            const insertResult = await db.collection("carrinhos").insertOne(novoCarrinho);
            carrinho = { ...novoCarrinho, _id: insertResult.insertedId };
        } else {
            // Se existir, deve adicionar o item ao carrinho existente
            const index = carrinho.itens.findIndex((item: ItemCarrinho) => item.produtoId === produtoId);
            if (index > -1) {
                // Se o item já existe, atualiza a quantidade
                carrinho.itens[index].quantidade += quantidade;
            } else {
                // Se não existe, adiciona novo item
                carrinho.itens.push(novoItem);
            }
            // Calcular o total do carrinho
            carrinho.total = carrinho.itens.reduce((acc: number, item: ItemCarrinho) => acc + item.precoUnitario * item.quantidade, 0);
            // Atualizar a data de atualização do carrinho
            carrinho.dataAtualizacao = new Date();
            await db.collection("carrinhos").updateOne(
                { usuarioId },
                { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
            );
        }

        res.status(200).json({ message: "Item adicionado ao carrinho com sucesso" });
    }
    //removerItem
    //atualizarQuantidade
    //listar
    //remover                -> Remover o carrinho todo
}

export default new CarrinhoController();