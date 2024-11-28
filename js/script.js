const file = document.querySelector('#file');
const deAllICs = document.querySelector('#allICs');
const icDuplicated = document.querySelector('#icDuplicated');
const newICs = document.querySelector('#newICs');
const totalIC = document.querySelector('#totalIC');
const maxIc = document.querySelector('#maxIc');

//Importando as funções
import { 
  fnICXml, 
  fnGetIC, 
  fnValidHasIC, 
  fnDistinct, 
  fnConvertDezena, 
  fnICInterval 
} from "./manipulateXml.js";


file.addEventListener('change', function() {
    const fileFull = this.files[0];
    const deReader = new FileReader();

    if(fileFull.type != "text/xml"){
      alert("Este arquvo não está no formato xml!");
    }else{ 
      //Pegar este conteúdo e usar na função
      deReader.addEventListener('load', function() {
          const nameIC = fileFull.name.substring(0,3).trim();
          const deFileStringIC = fnICXml(deReader.result,nameIC);
          const deIcFull = fnGetIC(nameIC,deFileStringIC);
        
          if(!deIcFull){
            alert("Arquivo fora do padrão: \n- Revise se o arquivo contém o nome do IC \n- Revise se o nome do IC está contido no arquivo \n- Revise se o arquivo contém algum IC")
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

      if(fileFull){
        deReader.readAsText(fileFull);
      }
    }
});


//Botão para limpar todos os campos da tela.
document.getElementById("clearFieldsBtn").addEventListener("click", function () {
  const inputs = document.querySelectorAll("textarea, input");
  
  //Limpa todos os valores
  inputs.forEach(field => {
    //Limpa o campo de upload
    if (field.type === "file") {
      field.value = ""; 
    //Limpa textareas e outros inputs
    } else {
      field.value = ""; 
    }
  });
});