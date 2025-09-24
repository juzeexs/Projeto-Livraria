describe("Teste para entrar na pagina inicial", () => {
  it("deve entrar na pagina inicial", () => {
    cy.visit("index.html");

   
    });
});
  

describe("Teste de dropdaw", () => {
  it("dropdaw funcionando", () => {
    cy.visit("index.html");

    it("teste de dropdaw", () =>{

  cy.get('#navbarDropdown')

    });
    });
  });

describe("teste de hovers",() => {
  it("testando hovers", () =>{
    cy.visit("index.html");

    it("testando hovers", () =>{
        cy.get('#card-livro:hover')

    })

  })
})


describe("teste de botões",() => {
  it("testando botões nos cards", () =>{
    cy.visit("index.html");
  
    it("testando botões",() =>{

      cy.get('#livros-inicio > :nth-child(1) > .card > .card-body > .btn')





    })
  })
})


describe("teste de botão de voltar no menu de adicionar o livro ao carrinho", () => {
  it("testando botão de voltar", () =>{
    cy.visit("index.html");

    it("testando botão de voltar", () =>{

      cy.get('.col-md-8 > .btn-outline-secondary')


    })
  })
})


describe("teste de botão adicionar ao carrinho" ,() => {
  it("testando botão adicionar ao carrinho", () =>{
    cy.visit("index.html");

    it("testando botão adicionar ao carrinho", () =>{

      cy.get('.col-md-8 > .btn-cta')





    })
  })
})


describe("teste de click nos cards", () => {
  it("testando click nos cards", () =>{
    cy.visit("index.html");

    it("testando click nos cards", () =>{
      cy.get("cy.get('#livros-inicio > :nth-child(1) > .card > .card-body').click()")




    })

  })

})



