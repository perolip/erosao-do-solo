let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let morros = [];
let helicoptero; // Variável para o helicóptero

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  // Inicializa os morros para o solo exposto
  if (tipoSolo === "exposto") {
    inicializarMorros();
  }
  helicoptero = new Helicoptero(0 - 50, 50); // Cria o helicóptero fora da tela à esquerda
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
      // Atualiza a altura dos morros após a erosão
      if (tipoSolo === "exposto") {
        atualizarAlturaMorros();
      }
    }
  }

  solo.mostrar();
  helicoptero.mostrar(); // Exibe o helicóptero
  helicoptero.atualizar(); // Atualiza a posição do helicóptero

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }

  // Mostra os morros (apenas se o solo for exposto)
  if (tipoSolo === "exposto") {
    for (let morro of morros) {
      morro.mostrar();
      morro.atualizarHorizontalmente();
    }
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  // Reinicializa os morros quando o tipo de solo muda para exposto
  if (tipoSolo === "exposto") {
    inicializarMorros();
  } else {
    morros = []; // Limpa os morros para outros tipos de solo
  }
}

function inicializarMorros() {
  morros = [];
  for (let i = 0; i < 3; i++) {
    morros.push(new Morro(random(width), solo.altura - random(20, 50), random(30, 60)));
  }
}

function atualizarAlturaMorros() {
  for (let morro of morros) {
    morro.yBase = solo.altura - morro.alturaInicial;
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") {
      fill(60, 150, 60);
      this.desenharVegetacao();
    } else if (this.tipo === "exposto") {
      fill(139, 69, 19); // Cor marrom para o solo exposto
    } else if (this.tipo === "urbanizado") {
      fill(120); // Cor cinza para o solo urbanizado
      this.desenharAreaUrbanizada();
    }

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
  desenharVegetacao() {
    // Desenha várias árvores com um modelo diferente
    this.desenharArvore(50, this.altura, color(0, 100, 0)); // Árvore verde
    this.desenharArvore(150, this.altura, color(0, 120, 0)); // Outra tonalidade de verde
    this.desenharArvore(250, this.altura, color(80, 150, 80));
    this.desenharArvore(350, this.altura, color(50, 90, 50));
    this.desenharArvore(450, this.altura, color(20, 70, 20));
    this.desenharArvore(550, this.altura, color(70, 130, 70));
  }

  desenharArvore(x, yBaseSolo, corFolha) {
    let alturaTronco = 40;
    let raioCopa = 25;
    let baseTroncoY = yBaseSolo - alturaTronco;

    fill(101, 67, 33); // Tronco marrom (um pouco mais claro)
    rect(x - 5, baseTroncoY, 10, alturaTronco);
    fill(corFolha); // Cor da folha passada como argumento
    ellipse(x, baseTroncoY - raioCopa, raioCopa * 2, raioCopa * 2);
  }

  desenharAreaUrbanizada() {
    // Desenha vários prédios com cores diferentes
    this.desenharPredio(50, this.altura - 60, 30, 60, color(100)); // Cinza mais escuro
    this.desenharPredio(120, this.altura - 80, 40, 80, color(130)); // Cinza um pouco mais claro
    this.desenharPredio(200, this.altura - 50, 35, 50, color(160));
    this.desenharPredio(280, this.altura - 70, 45, 70, color(90));
    this.desenharPredio(360, this.altura - 90, 50, 90, color(140));
  }

  desenharPredio(x, yBase, largura, altura, corPredio) {
    fill(corPredio); // Cor do prédio passada como argumento
    rect(x, yBase, largura, altura);
    fill(200); // Cor das janelas (mantive a mesma)
    let numJanelasVert = floor(altura / 15);
    let numJanelasHoriz = floor(largura / 15);
    for (let i = 0; i < numJanelasVert - 1; i++) {
      for (let j = 0; j < numJanelasHoriz - 1; j++) {
        rect(x + 5 + j * 15, yBase + 5 + i * 15, 10, 10);
      }
    }
  }
}

class Morro {
  constructor(x, yBaseInicial, largura) {
    this.x = x;
    this.yBase = yBaseInicial;
    this.largura = largura;
    this.alturaInicial = random(15, 30);
    this.velocidade = random(0.5, 1.5);
    this.direcao = random([-1, 1]); // -1 para esquerda, 1 para direita
  }

  mostrar() {
    fill(139, 69, 19); // Cor marrom para os morros
    triangle(this.x, this.yBase + this.alturaInicial, this.x + this.largura, this.yBase + this.alturaInicial, this.x + this.largura / 2, this.yBase);
  }

  atualizarHorizontalmente() {
    this.x += this.velocidade * this.direcao;
    if (this.x > width + this.largura / 2) {
      this.x = -this.largura / 2;
    } else if (this.x < -this.largura / 2) {
      this.x = width + this.largura / 2;
    }
  }
}

class Helicoptero {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tamanho = 30; // Tamanho base do helicóptero
    this.velocidadeX = 0.5; // Velocidade horizontal
    this.anguloHelice = 0; // Ângulo atual da hélice
    this.velocidadeRotacao = 0.2; // Velocidade de rotação da hélice
    this.corCorpo = color(0, 0, 255); // Azul para o corpo
    this.corCabine = color(100, 100, 255); // Azul mais claro para a cabine
    this.corRotor = color(50); // Cinza mais escuro para o rotor
  }

  mostrar() {
    push(); // Salva o estado de estilo e transformação
    translate(this.x, this.y); // Move a origem para a posição do helicóptero

    // Corpo principal (azul)
    fill(this.corCorpo);
    ellipse(0, 0, this.tamanho * 1.5, this.tamanho * 0.5);

    // Cabine (azul mais claro)
    fill(this.corCabine);
    ellipse(-this.tamanho * 0.3, -this.tamanho * 0.2, this.tamanho * 0.6, this.tamanho * 0.4);

    // Rotor principal (cinza escuro) - ROTACIONANDO
    push();
    rotate(this.anguloHelice);
    fill(this.corRotor);
    rect(-this.tamanho * 0.5, -this.tamanho * 0.1, this.tamanho, this.tamanho * 0.2, 2);
    rect(-this.tamanho * 0.1, -this.tamanho * 0.5, this.tamanho * 0.2, this.tamanho * 0.6, 2);
    pop();

    // Rotor de cauda (cinza escuro)
    fill(this.corRotor);
    ellipse(this.tamanho * 0.7, 0, this.tamanho * 0.3, this.tamanho * 0.3);
    line(this.tamanho * 0.55, -this.tamanho * 0.15, this.tamanho * 0.85, this.tamanho * 0.15);

    // Trem de pouso (cinza escuro)
    stroke(this.corRotor);
    line(-this.tamanho * 0.5, this.tamanho * 0.3, -this.tamanho * 0.2, this.tamanho * 0.5);
    line(this.tamanho * 0.5, this.tamanho * 0.3, this.tamanho * 0.2, this.tamanho * 0.5);
    noStroke();

    pop(); // Restaura o estado de estilo e transformação

    this.atualizarHelice(); // Atualiza o ângulo da hélice para o próximo frame
  }

  atualizar() {
    this.x += this.velocidadeX;
    // Se o helicóptero sair da tela pela direita, volta para a esquerda
    if (this.x > width + 50) {
      this.x = -50;
    }
  }

  atualizarHelice() {
    this.anguloHelice += this.velocidadeRotacao;
  }
}
