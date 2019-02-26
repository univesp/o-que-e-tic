$(document).ready(function(){

  //Preload das animações
  $.preloadImages = function() {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
    }
  }
  $.preloadImages("assets/func-idle.gif","assets/func-digitando.gif","assets/chefe-idle.gif","assets/chefe-nivel1.gif","assets/chefe-nivel2.gif","assets/chefe-nivel3.gif");

  //Aciona o funcionamento das tooltips
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

// Ações do usuário que mostram e/ou escondem o logotipo.

//define se é a primeira tela, para não chamar o header quando a teoria for acessada novamente
var inicio = "sim";

  $(window).scroll(function(){
    var nav = $("nav");
    var scroll = $(window).scrollTop();
    if(inicio == "sim"){
      // Mostra o nav quando a página está no topo
      if(scroll == 0){
        nav.fadeIn();
      //Esconde a nav
      } else {
        nav.fadeOut();
      }
    }
  });

  // Seu código abaixo

  // Move o footer para dentro do app-header e faz uma cópia dele no modal de teoria
  $("footer").appendTo("#copia-footer");
  $("footer").clone().appendTo(".teoria-overlay");


  // CONTROLAM O MODAL DE TEORIA
  var caixaTeoria =  document.querySelector('.teoria-overlay')
  //Chama modal de teoria
  function chamaTeoria(){
    $(".teoria-overlay").addClass("d-flex");
    $(".teoria-overlay").removeClass('slideOutDown');
    $(".teoria-overlay").addClass('animated slideInUp');
    $(".dark-overlay").delay(200).fadeIn();
    console.log("chamando teoria")
  };
  //Dispensa modal de teoria
  function dispensaTeoria(){
    caixaTeoria.addEventListener('animationend', function tiraFlex(){
      caixaTeoria.classList.remove("d-flex");
      caixaTeoria.removeEventListener('animationend', tiraFlex);
    });
    $(".teoria-overlay").removeClass('animated slideInUp');
    $(".teoria-overlay").addClass('animated slideOutDown');
    $(".dark-overlay").delay(200).fadeOut();
    $('html,body').scrollTop(0);
    console.log("dispensando teoria");
    inicio = "não";
  };
  //Chama a navbar - acionado somente quando o REA é aberto
  function chamaHeader(){
    $("nav").fadeIn();
  }
  //Chama o botão de fechar - acionado quando o modal é chamado no decorrer do REA
  function chamaFechar(){
    $("#fechar-container").removeClass('animated fadeOutRight');
    $("#fechar-container").addClass('animated fadeInRight');
    $("#fechar-container").show();
  };
  //Dispensa o botão de fechar
  function dispensaFechar(){
    $("#fechar-container").removeClass('animated fadeInRight');
    $("#fechar-container").addClass('animated fadeOutRight');
  }

  //CHAMA O MODAL DE TEORIA AO INÍCIO DO REA
  setTimeout(chamaTeoria, 250);
  setTimeout(chamaHeader, 1100);

  //Funções do botão ao final do modal de teoria - dispensa o modal e inicia o chat
  $("#botao-modal").click(function(){
    if(inicio == "sim"){
      iniciaChat();
    }
    dispensaTeoria();
    dispensaFechar();
  });
  $(".botao-fechar").click(function(){
    dispensaTeoria();
    dispensaFechar();
  });
  $("#retoma-modal").click(function(){
    //Esconde a tooltip manualmente
    $('#retoma-modal').tooltip('hide')
    chamaTeoria();
    setTimeout(chamaFechar, 200);
  });

  //Controla o overlay do modal de teoria
  $(".overlay-container").click(function(){
    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
    } else {
      $(this).addClass('expanded');
    }
  })


  //CARDS
  $(".card-container").click(function(){
    if ($(this).hasClass('hover')) {
      $(this).removeClass('hover');
    } else {
      $(this).addClass('hover');
    }
  });

  // CHAT

  // Variáveis globais

  var pontuacao = $("#pontuacao");
  var pontuacao_val = 0;
  var altura_inicial = $(".tela-conversa").height();
  var alternativa = $("#alternativas [class^='nivel']");

  // Funções globais

  function scroll_to_bottom(){
    $('#container-conversa').animate({ scrollTop: $(".tela-conversa").height() }, "slow");
  }

  // Inicia mostrando mensagens do chefe e alternativas do assunto 1

  function iniciaChat(){
    //Mostra a tooltip manualmente
    setTimeout(function(){
    $('#retoma-modal').tooltip('show')
  }, 1200);


    var pergunta = $("#conversa .assunto1").find(".pergunta");
    var pergunta_length = $(".assunto1 .pergunta").find(".chefe").length;
    um_balao_por_vez(1);

    function um_balao_por_vez(i){
      setTimeout(function(){
        $("#container-chefe img").attr("src","assets/chefe-digitando.gif");
      }, 1200);
      pergunta.find(".chefe:nth-child("+ i +")").delay(2000).fadeIn(function(){
        if(i < pergunta_length){
          i = i+1;
          um_balao_por_vez(i);
        } else {
          $("#alternativas .assunto1").delay(3000).fadeIn();
          setTimeout(scroll_to_bottom, 3000);
          setTimeout(function(){
          $('#retoma-modal').tooltip('hide');
          $("#container-chefe img").attr("src","assets/chefe-idle.gif");
          }, 3000);
        };

      });
    }
  }


  // Clique em uma alternativa dispara eventos da conversa

  alternativa.on("click", function(){

    // Variáveis locais

    var assunto = $(this).parent().attr("class");
    var nivel = $(this).attr("class");
    var this_alternativas = $(this).parent();
    var this_conversa = $("#conversa ." + assunto);

    // Roda o primeiro evento, que irá cascatear.

    esconde_alternativas();

    // 1. Esconde o campo das alternativas

    function esconde_alternativas(){
      this_alternativas.fadeOut(anima_funcionario());
    }

    // 2. Anima funcionário

    function anima_funcionario(){
      var funcionario = $("#container-func img");
      // setTimeout(function(){
      funcionario.attr("src", "assets/func-digitando.gif");
      console.log("funcionario digitando")
    // }, 1000);
      setTimeout(function(){
        clona_resposta();
        funcionario.attr("src", "assets/func-idle.gif");
      }, 1000);
    }

    // 2. Insere na conversa a alternativa escolhida

    function clona_resposta(){
      var resposta = $("#alternativas ." + assunto + " ." + nivel + " *");
      this_conversa.find(".resposta").append(resposta);
      this_conversa.find(".resposta").delay(0).fadeIn(function(){
        setTimeout(anima_chefe, 1000);
      });
      scroll_to_bottom();
    }

    // 3. Anima chefe

    function anima_chefe(){
      if(nivel == 'nivel1'){
        var imagem = "chefe-nivel1.gif";
        $("#container-chefe img").attr("src","assets/" + imagem);
        setTimeout(mostra_feedback, 1980);
      } else if(nivel == 'nivel2'){
        var imagem = "chefe-nivel2.gif";
        $("#container-chefe img").attr("src","assets/" + imagem);
        setTimeout(mostra_feedback, 3700);
      } else if(nivel == 'nivel3'){
        var imagem = "chefe-nivel3.gif";
        $("#container-chefe img").attr("src","assets/" + imagem);
        setTimeout(mostra_feedback, 1200);
      }
    }

    // 4. Mostra o feedback adequado

    function mostra_feedback(){
      var feedback = this_conversa.find(".feedback." + nivel);
      var feedback_length = feedback.find(".chefe").length;
      um_balao_por_vez(1);

      function um_balao_por_vez(i){
        setTimeout(function(){
          $("#container-chefe img").attr("src","assets/chefe-digitando.gif");
        }, 800);
        setTimeout(scroll_to_bottom, 2300);
        feedback.find(".chefe:nth-child("+ i +")").delay(2300).fadeIn(function(){
          if(i < feedback_length){
            i = i+1;
            um_balao_por_vez(i);
          } else {
            mostra_link();
          }
        });
      }
    };

    // 5. Mostra o link

    function mostra_link(){
      setTimeout(function(){
        $("#container-chefe img").attr("src","assets/chefe-digitando.gif");
      }, 900);
      setTimeout(scroll_to_bottom, 2500);
      this_conversa.find(".link").delay(2500).fadeIn(atualiza_pontuacao);
    }

    // 6. Atualiza a pontuação

    function atualiza_pontuacao(){

      // Determina a pontuação de cada nível de resposta

      if(nivel == 'nivel1'){
        var pontos_novos = 1;
      } else if(nivel == 'nivel2'){
        var pontos_novos = 2;
      } else if(nivel == 'nivel3'){
        var pontos_novos = 3;
      }

      // Abre popup com estrelas conquistadas

      var popup = $(".big-stars-container")

      setTimeout(function(){
        popup.fadeIn(800)
      }, 1500);
      for(i = 1; i <= pontos_novos; i++){
        popup.find("i:nth-child(" + i + ")").toggleClass("star-on star-off");
      };
      setTimeout(function(){
        $(".big-stars").addClass("pracima");

        // Reinicia estrelas

        popup.fadeOut(800, function(){
          popup.find("i").attr("class", "material-icons star-off");
          $(".big-stars").removeClass("pracima");
        });

        // Volta para estado padrão do chefe

        $("#container-chefe img").attr("src","assets/chefe-idle.gif");

        setTimeout(painel, 800);

      }, 5000);

      // Registra pontuação no painel do usuário

      function painel(){

        i = 0;
        while (i < pontos_novos){
          pontuacao_val++;
          pontuacao.find(".stars i:nth-of-type("+pontuacao_val+")").removeClass("star-off");
          pontuacao.find(".stars i:nth-of-type("+pontuacao_val+")").addClass("star-on animated tada");
          i++;
        };

        // Define próximo passo:
        // Se não for a última pergunta, carrega a seguinte
        // Se for a última, conclui o rea

        setTimeout(function(){
          if(assunto != $("#conversa > div:last-child").attr("class")){
            mostra_pergunta(this_conversa)
          } else {
            conclui_rea();
            $(".app-header-btn").hide();
            $(".avatar").addClass("final");
          }
        }, 2000);

      }

    }

    // 7. Mostra nova pergunta

    function mostra_pergunta(this_conversa){
      this_conversa = this_conversa.next();
      var pergunta = this_conversa.find(".pergunta");
      var pergunta_length = pergunta.find(".chefe").length;
      um_balao_por_vez(1);

      function um_balao_por_vez(i){
        setTimeout(function(){
          $("#container-chefe img").attr("src","assets/chefe-digitando.gif");
        }, 900);
        setTimeout(scroll_to_bottom, 2000);
        pergunta.find(".chefe:nth-child("+ i +")").delay(2000).fadeIn(function(){
          if(i < pergunta_length){
            i = i+1;
            um_balao_por_vez(i);
          } else {
            setTimeout(function(){
            mostra_alternativas(i);
            $("#container-chefe img").attr("src","assets/chefe-idle.gif");
          }, 2500);
          };
        });
      }
    }

    // 8. Mostra alternativas da nova pergunta

    function mostra_alternativas(){
      this_alternativas = this_alternativas.next();
      setTimeout(scroll_to_bottom, 500);
      this_alternativas.delay(500).fadeIn();
    }

  });

  // Encerra recurso expandindo o header

  function conclui_rea(){
    $(".stars").hide();
    $(".stars").delay(400).fadeIn();
    $("nav").fadeToggle(400);
    $(".app-header").toggleClass("concluido");
    $(".stars i").removeClass("animated tada");
  }


$('body').on('click', '.avatar.final', function() {
  conclui_rea();
  var botaoheader = $(".app-header-btn");
  if (botaoheader.is(":visible")){
    $(".app-header-btn").hide();
  } else {
    $(".app-header-btn").delay(900).show(0);
  }
});



  // Recolhe o header para explorar todo o diálogo
  $("#recolher").click(function(){
    conclui_rea();
    $(".app-header-btn").delay(900).show(0);
  })






});
