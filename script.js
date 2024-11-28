const file = document.querySelector('#file');
const deAllICs = document.querySelector('#allICs');
const icDuplicated = document.querySelector('#icDuplicated');
const newICs = document.querySelector('#newICs');
const totalIC = document.querySelector('#totalIC');
const maxIc = document.querySelector('#maxIc');


//Função criada para receber o texto XML e retornar apenas os ICs válidos
const fnICXml = (file,nameIC) => {
  const fileXml = new DOMParser().parseFromString(file,'text/xml');
  const deGeneralXMLFull = fileXml.querySelectorAll("mxfile");

  let xmlfinal = '';
  let deNameIC = nameIC + '.';

  //Pegando o xml geral que será usado posteriormente
  const deGeneralXML = deGeneralXMLFull[0]
    .querySelector("diagram")
    .querySelector("mxGraphModel")
    .querySelector("root");

  //Selecionando os campos separadamente para validação
  const mxCells = deGeneralXML.querySelectorAll("mxCell");
  const userObject = deGeneralXML.querySelectorAll("UserObject");

  //filtrando os mxCells que são os losangos usados para dizer se o usuário passou ou não por tal IC
  //Os ICs desses losangos devem ser ignorados no código para não aparecerem duplicados na validação
  mxCells.forEach(item => {
      if(!item.outerHTML.toLowerCase().includes(`passou pelo`) &&
          !item.outerHTML.toLowerCase().includes(`<mxgeometry x="8.33"`) &&
          !fnValidHasIC(nameIC.toLowerCase(),item.outerHTML.toLowerCase()) &&
          !item.outerHTML.toLowerCase().includes(`(${nameIC.toLowerCase()}`) &&
          !item.outerHTML.toLowerCase().includes(nameIC.toLowerCase())){
          xmlfinal += item.outerHTML;
      };
  });

  //Pegando todos os conectores que contenham algum IC
  userObject.forEach(item => {
    if(!item.outerHTML.toLowerCase().includes(`tags="conector"`.toLowerCase()) &&
        !item.outerHTML.toLowerCase().includes(`link="data:page`) &&
        !item.outerHTML.toLowerCase().includes(`<mxgeometry x="1999"`) &&
        !fnValidHasIC(nameIC.toLowerCase(),item.outerHTML.toLowerCase()) &&
        !item.outerHTML.toLowerCase().includes(`(${nameIC.toLowerCase()}`) &&
        item.outerHTML.toLowerCase().includes(nameIC.toLowerCase())){    
        xmlfinal += item.outerHTML;
    }
  });

  //Campo retorna como uma string;
  return xmlfinal;
};

//Função para trazer todos os ICs a partir de um regex
const fnGetIC = (nameIC, text) => {
  const regex = new RegExp(`${nameIC}\\.[0-9]{3,4}`, "gi");
  const data = text.match(regex);

  //reordenando do menor para o maior
  data?.sort((a,b) => parseInt(a.split('.')[1]) - b.split('.')[1]);
  return data;
};


//Função que valida se existe algum IC com os parenteses
const fnValidHasIC = (nameIC, text) => {
  const regex1 = new RegExp(`\\(${nameIC}\\.[0-9]{3,4}`, "gi");
  const regex2 = new RegExp(`${nameIC}\\.[0-9]{3,4}\\)`, "gi");
  
  if(regex1.test(text) || regex2.test(text)){
      return true;
  }
  return false;
};

//Função para trazer os valores distintos e os repetidos
const fnDistinct = (value) => {
    const arrayDist = [];
    const arrayRepeat = [];
  
    value?.forEach(item => {
        if(!arrayDist.some(element => element == item)){
            arrayDist.push(item);
        }else{
          if(!arrayRepeat.some(element => element == item)){
            arrayRepeat.push(item);
          }
        }
    });
   
    return {
      arrayDist,
      arrayRepeat
    };
};


//Função que adiciona um zero à esquerda caso haja apenas 1 algarismo
const fnConvertDezena = (value) => {
  if(value.length == 1){
    return `00${value}`;
  }else if(value.length == 2){
    return `0${value}`;
  }
  return value;
}

//Função para retornar o Intervalo de ICs faltantes (sugestão)
const fnICInterval = (data,maxIc,nameIC) => {
  const dataIcInterval = [];

  for(let i = 1; i <= maxIc; i++){
    if(!data.find(item => item == i)){
      dataIcInterval.push(nameIC + '.' + fnConvertDezena(i.toString()));
    };
  }

  return dataIcInterval;
};


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