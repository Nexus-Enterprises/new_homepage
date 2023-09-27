var itensSelecionados = document.getElementsByClassName('item-type');
var divTextMoni = document.getElementById('text-moni');
var guilherme = document.getElementById("guilherme");
var jeremias = document.getElementById("jeremias");
var lisandra = document.getElementById("lisandra");
var lucas = document.getElementById("lucas");
var marcos = document.getElementById("marcos");
var michael = document.getElementById("michael");
var status = document.getElementById("status");


for (var i = 0; i < itensSelecionados.length; i++) {
    itensSelecionados[i].addEventListener('click', function click(e) {
        if (this.classList.contains('cpu')) {

            divTextMoni.style.opacity = 0;
            setTimeout(function(){
            divTextMoni.innerHTML = '';
            divTextMoni.innerHTML = `
                <div class="left-side-moni">
                    <h2 class="title-moni">
                        O monitoramento do uso do seu processador.
                    </h2>
                    <p class="subtext-moni">
                        Nós do Nexus iremos sempre estar monitorando o seu processador
                        para que voce possa entender quaisprocessos e tarefas estão
                        comprometendo o seu sistema.
                    </p>
                </div>
                <div class="right-side-moni">
                    <img src="./assets/img-nexus/cpu.svg" alt="Desenho de um processador" srcset="">
                </div>`
                divTextMoni.style.opacity = 1;
            },200)
            
        } else if (this.classList.contains('ram')) {

            divTextMoni.style.opacity = 0;

            setTimeout(function () {
            
            divTextMoni.innerHTML = '';
            divTextMoni.innerHTML = `
            <div class="left-side-moni">
                <h2 class="title-moni">
                    O monitoramento do uso das suas memorias.
                </h2>
                <p class="subtext-moni">
                    Nós do Nexus iremos sempre estar monitorando a sua memoria
                    para que voce possa entender quais processos e tarefas estão
                    comprometendo o seu sistema.
                </p>
            </div>
            <div class="right-side-moni">
                <img src="./assets/img-nexus/memorias 1.svg" alt="Desenho de um processador" srcset="">
            </div>`
            
            divTextMoni.style.opacity = 1;

            }, 200)

        } else if (this.classList.contains('disco')) {

            divTextMoni.style.opacity = 0;
            

            setTimeout(function(){

                divTextMoni.innerHTML = '';
                divTextMoni.innerHTML = `
                <div class="left-side-moni">
                    <h2 class="title-moni">
                        O monitoramento do uso do disco.
                    </h2>
                    <p class="subtext-moni">
                        Nós do Nexus iremos sempre estar monitorando o uso do seu disco
                        para que voce possa entender quais arquivos e tarefas estão
                        comprometendo o seu sistema.
                    </p>
                </div>
                <div class="right-side-moni">
                    <img src="./assets/img-nexus/disco.svg" alt="Desenho de um processador" srcset="">
                </div>`

                divTextMoni.style.opacity = 1;

            },200)
            
        } else {
            console.log('nao achei diabo nenhum')
        }
        for (var j = 0; j < itensSelecionados.length; j++) {
            itensSelecionados[j].classList.remove('item-selected');
        }
        this.classList.add('item-selected');
    });
}

guilherme.addEventListener("click", function(){
    guilherme.classList.toggle("flip");
    
})
jeremias.addEventListener("click", function(){
    jeremias.classList.toggle("flip");
})
lisandra.addEventListener("click", function(){
    lisandra.classList.toggle("flip");
})
lucas.addEventListener("click", function(){
    lucas.classList.toggle("flip");
})
marcos.addEventListener("click", function(){
    marcos.classList.toggle("flip");
})
michael.addEventListener("click", function(){
    michael.classList.toggle("flip");
})

