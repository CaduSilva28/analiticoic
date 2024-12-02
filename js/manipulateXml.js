//Função criada para receber o texto XML e retornar apenas os ICs válidos
export const fnICXml = (file,nameIC) => {
    let xmlfinal = '';
    let deNameIC = nameIC + '.';
    
    //Selecionando os campos separadamente para validação
    const mxCells = file.querySelectorAll("mxCell");
    const userObject = file.querySelectorAll("UserObject");
  
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
export const fnGetIC = (nameIC, text) => {
    const regex = new RegExp(`${nameIC}\\.[0-9]{3,4}`, "gi");
    const data = text.match(regex);
  
    //reordenando do menor para o maior
    data?.sort((a,b) => parseInt(a.split('.')[1]) - b.split('.')[1]);
    return data;
  };
  
  
  //Função que valida se existe algum IC com os parenteses
  export const fnValidHasIC = (nameIC, text) => {
    const regex1 = new RegExp(`\\(${nameIC}\\.[0-9]{3,4}`, "gi");
    const regex2 = new RegExp(`${nameIC}\\.[0-9]{3,4}\\)`, "gi");
    
    if(regex1.test(text) || regex2.test(text)){
        return true;
    }
    return false;
};
  
//Função para trazer os valores distintos e os repetidos
export const fnDistinct = (value) => {
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
export const fnConvertDezena = (value) => {
    if(value.length == 1){
      return `00${value}`;
    }else if(value.length == 2){
      return `0${value}`;
    }
    return value;
}
  
//Função para retornar o Intervalo de ICs faltantes (sugestão)
  export const fnICInterval = (data,maxIc,nameIC) => {
    const dataIcInterval = [];
  
    for(let i = 1; i <= maxIc; i++){
      if(!data.find(item => item == i)){
        dataIcInterval.push(nameIC + '.' + fnConvertDezena(i.toString()));
      };
    }
  
    return dataIcInterval;
};

//Função para retornar uma lista com as jornadas
export const fnListFlow = (value) => {
  const mxFile = value.querySelectorAll("mxfile");
  const diagram = mxFile[0].querySelectorAll("diagram");

  //nomes que devem ser ignorados na listagem
  const flowIgnore = [ 'capa', 'legenda', 'regras', 'srt' ];
  const arrayFlow = [{ "value": "SRT", "text": "SRT - Consolidado" }];

  diagram?.forEach(item => {
    let atribute = item?.getAttribute("name").toLowerCase();

    if(!flowIgnore.some(item => atribute.includes(item))){
      arrayFlow.push({ "value": atribute.toUpperCase().substring(0,3).trim(), "text": item?.getAttribute("name") });
    };
  });

  //retorna um array com toda lista de fluxo
  return arrayFlow;
};


//função para preencer o Select
export const fnSelect = (fileXml,selectElement) => {
  //Array com os valores
  const optionsArray = fnListFlow(fileXml)  

  //Itera sobre o array e adiciona as opções ao <select>
  optionsArray.forEach(option => {
    const newOption = document.createElement('option'); 
    newOption.value = option.value;
    newOption.textContent = option.text;
    selectElement.appendChild(newOption);
  });
}

//Função que retorna o root do fluxo selecionado
export const fnRoot = (file,nameFlow,exectuteSelect) => {
  const mxFile = file.querySelectorAll("mxfile");
  const diagrams = mxFile[0].querySelectorAll("diagram");
  let selectedDiagram;

  if(nameFlow.toLowerCase().includes('srt')){
    selectedDiagram = Array.from(diagrams).filter(item => item.getAttribute("name").toLowerCase().includes('srt'));

    //Parse o XML para DOM (se ainda não for um documento XML)
    const root1 = selectedDiagram[0].querySelector("mxGraphModel").querySelector("root");
    const root2 = selectedDiagram[1].querySelector("mxGraphModel").querySelector("root");

    //Se já executou o select na primeira vez, não adiciona o filho no arquivo princial
    if(exectuteSelect){
      return root1;
    };

    //Adicione os filhos de root2 a root1
    Array.from(root2.children).forEach((child) => {
      root1.appendChild(child.cloneNode(true)); //Clona e adiciona ao root1
    });

    return root1;
  }else{
    selectedDiagram = Array.from(diagrams).find(item => item.getAttribute("name") === nameFlow);
    return selectedDiagram.querySelector("mxGraphModel").querySelector("root");
  }
};