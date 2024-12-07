const file = document.querySelector('#file');
const deAllICs = document.querySelector('#allICs');
const icDuplicated = document.querySelector('#icDuplicated');
const newICs = document.querySelector('#newICs');
const totalIC = document.querySelector('#totalIC');
const maxIc = document.querySelector('#maxIc');
const selectElement = document.querySelector('#mySelect');

let fileFull;
let deReader;
let fileXml;
let exectuteSelect = false;

//Importando as funções
import { 
  fnICXml, 
  fnGetIC, 
  fnValidHasIC, 
  fnDistinct, 
  fnConvertDezena, 
  fnICInterval,
  fnListFlow,
  fnSelect,
  fnRoot
} from "./manipulateXml.js";

//Assim que eu subir um arquivo, eu atualizo o meu select

file.addEventListener('change', function() {
  fileFull = this.files[0];
  deReader = new FileReader();

  if(fileFull.type != "text/xml"){
    alert("Este arquivo não está no formato xml!");
  }else{ 
    //Pegar este conteúdo e usar na função
    deReader.addEventListener('load', function() {
      fileXml = new DOMParser().parseFromString(deReader.result,'text/xml');

      //Executa a função que popula o SELECT
      fnSelect(fileXml,selectElement);
      
      //Dispara o evento select
      selectElement.dispatchEvent(new Event("change"));
    });

    if(fileFull){
      deReader.readAsText(fileFull);
    }
  };
});

//A cada alteração no select, eu devo carregar os dados do fluxo em questão em tela
selectElement.addEventListener("change", () => {
  const elementSelect = selectElement.value;

  //Retorna o nome do fluxo
  const deFlow = fnListFlow(fileXml)?.find(item => item.value == elementSelect);
  const nmFlow = deFlow?.text;
  const nameIC = deFlow?.value;

  //Retorna o root do xml
  const rootXml = fnRoot(fileXml,nmFlow,exectuteSelect);

  const deFileStringIC = fnICXml(rootXml,nameIC);

  const deIcFull = fnGetIC(nameIC,deFileStringIC);

  if(!deIcFull){
    alert("Nenhum IC encontrado neste fluxo");
  };
  
  const arrayDist = fnDistinct(deIcFull).arrayDist;

  //Montando uma lista com os ICs e seus valores para validar o maior e o intervalo faltante
  const arrayNumDist = [];

  arrayDist.forEach(item => {
    arrayNumDist.push({ "icFull": item.split('.')[1], "icNumber": parseInt(item.split('.')[1]) });
  });

  const icMaxNumber = Math.max(...arrayNumDist.map(item => item.icNumber));
  const icMaxFull = arrayNumDist.find(item => item.icNumber == icMaxNumber)?.icFull;
  const nuTotalIc = fnDistinct(deIcFull).arrayDist.length;

  //Atualizando os campos em tela
  deAllICs.value = arrayDist;
  icDuplicated.value = fnDistinct(deIcFull).arrayRepeat;
  newICs.value = fnICInterval(arrayNumDist.map(item => item.icNumber),icMaxNumber,nameIC);
  maxIc.value = icMaxFull ? nameIC + '.' + icMaxFull : '';
  totalIC.value = nuTotalIc ? nuTotalIc : '';
});

//Botão para limpar todos os campos da tela.
document.getElementById("clearFieldsBtn").addEventListener("click", function () {
  //Recarrega tudo e deleta todos os campos em dela
  location.reload(true);
});
