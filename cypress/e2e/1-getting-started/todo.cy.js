  //CT01//
describe("Teste para entrar na pagina inicial", () => {
  it("deve entrar na pagina inicial", () => {
    cy.visit("index.html");

   
    });
});
  
//CT02//
describe("Teste de dropdawn", () => {
  it("testando dropdown", () => {
    cy.visit("index.html");

    it("teste de dropdown", () =>{

  cy.get('#seletor-do-Dropdown')

    });
    });
  });
//CT03//
describe("teste de hovers",() => {
  it("testando hovers", () =>{
    cy.visit("index.html");

    it("testando hovers", () =>{
        cy.get('#card-livro:hover')

    })

  })
})

//CT04//
describe("teste de botões",() => {
  it("testando botões nos cards", () =>{
    cy.visit("index.html");
  
    it("testando botões",() =>{

      cy.get('#livros-inicio > :nth-child(1) > .card > .card-body > .btn')





    })
  })
})

//CT05//
describe("teste de botão de voltar no menu de adicionar o livro ao carrinho", () => {
  it("testando botão de voltar", () =>{
    cy.visit("index.html");

    it("testando botão de voltar", () =>{

      cy.get('.col-md-8 > .btn-outline-secondary')


    })
  })
})

//CT06//
describe("teste de botão adicionar ao carrinho" ,() => {
  it("testando botão adicionar ao carrinho", () =>{
    cy.visit("index.html");

    it("testando botão adicionar ao carrinho", () =>{

      cy.get('.col-md-8 > .btn-cta')





    })
  })
})

//CT07//
describe("teste de click nos cards", () => {
  it("testando click nos cards", () =>{
    cy.visit("index.html");

    it("testando click nos cards", () =>{
      cy.get("cy.get('#livros-inicio > :nth-child(1) > .card > .card-body').click()")




    })

  })

})

//CT08//
describe("teste de imput ", ()=> {
  it("testando o imput ",() => {
    cy.visit("index.html");

    it("testando o imput", () =>{
      cy.get('#newsletter-input')
      
      it("testando botão de assinar",()=>{
        cy.get('#btn-assinar')

      })
  
    })
  })
})


//CT09//
describe("teste de login", () => {
  it("testando login", () =>{
    cy.visit("index.html");

    it("testando login de email", () =>{
      cy.get('#login-email')

      it("testando senha", () =>{
        cy.get('#login-password')

        it("testando botão de entrar", () =>{
          cy.get('#login-form > .d-grid > .btn')


        })
      })
    })
  })
})

//CT10//
describe("teste de cores", () => {
  it("testando seleção de cores", () =>{
    cy.visit("index.html");

    it("testando vermelho", () =>{
      cy.get('[data-theme="default"]')

      it("testando azul", () =>{
        cy.get('[data-theme="blue"]')

      it("testando roxo", () =>{
        cy.get('[data-theme="purple"]')

      it("multicolor", () =>{
        cy.get('[data-theme="rainbow"]')


          })
        })

      })

    })
  })
})

//CT11//
describe("testando acessibilidade", () => {
  it("testando acessibilidade", () =>{
    cy.visit("index.html");

    it("testando acessibilidade", () =>{
      cy.get('[data-font="normal"]')




    })

    it("testando acessibilidade", () =>{
      cy.get('[data-font="large"]')
    })


  })


})


describe("testando botão de zoom do mapa", () => {
  it("testando botão de zoom do mapa", () =>{
    cy.visit("index.html");

    it("testando botão de zoom do mapa", () =>{
      cy.get('.ol-zoom-in')

    })
      
  })

})


describe("testando botão de zoom out do mapa", () => {
  it("testando botão de zoom out do mapa", () =>{
    cy.visit("index.html");

    it("testando botão de zoom out do mapa", () =>{
      cy.get('.ol-zoom-out')



    })
  })
})


describe("testando mapa", () => {
  it("testando mapa", () =>{
    cy.visit("index.html");

it("testando mapa", () =>{
  cy.get('#mapa-localizacao')



    })
  })
})



describe("testando se existe cards no site", () => {
  it("testando se existe cards no site", () =>{
    cy.visit("index.html");

    it("testando se existe cards no site", () =>{
      cy.get('#livros-inicio > :nth-child(5) > .card > .card-body')
      should('exist')

    })


  })

})
