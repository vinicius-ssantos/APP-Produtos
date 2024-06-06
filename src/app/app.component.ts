import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProdutoService } from './service/produto.service';
import { Produto } from './model/produto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {
  produtos: Produto[] = [];

  // criando um formulário reativo para o cadastro de produtos
  produtoForm = this.fb.group({
    id: [],
    nome: [null, Validators.required],
    valor: [null, Validators.required],
    descricao: []
  })

  // construtor injetando o FormBuilder e o ProdutoService
  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService
  ) {


    this.buscarProdutos();
  }

  buscarProdutos() {
    this.produtoService.buscarTodos().subscribe({
      next: (resultado) => {
        this.produtos = resultado;
      }, error: (error) => {
        console.log('Erro ao buscar os produtos', error)
      }
    })
  }


  // método para salvar um produto 
  criarProduto(): Produto {
    return {
      id: this.produtoForm.get('id')?.value,
      nome: this.produtoForm.get('nome')?.value,
      valor: this.produtoForm.get('valor')?.value,
      descricao: this.produtoForm.get('descricao')?.value
    }
  }

  // faz a comunicação com o serviço para salvar um produto
  salvar() {
    // verifica se o formulário é válido
    if (this.produtoForm.valid) {
      const produto = this.criarProduto();
      console.log('produto', produto)
      // faz a chamada para o serviço salvar o produto
      this.produtoService
        .salvar(produto)
        // se inscreve para receber a resposta do serviço
        .subscribe({
          next: (produto) => {
            this.produtoForm.reset();
            this.buscarProdutos();
            alert('Produto salvo com sucesso');
            this.produtoForm.reset();
          },
          error: (error) => {
            console.log('Erro ao salvar o produto', error)
          }
        })
    }
  }

  remover(produto: Produto) {
    const confirmacao = confirm('Deseja realmente remover o produto? ' + produto.nome);

    if(confirmacao){
      const id = produto.id ?? 0;
      this.produtoService.remover(id).subscribe({
        next: (resultado) => {
          this.buscarProdutos();
          alert('Produto removido com sucesso');
        }, error: (error) => {
          console.log('Erro ao remover o produto', error)
        }
      })
    }
  }
}
