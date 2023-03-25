let melody = document.querySelector('div.Melody input')
let title = document.querySelector('div.Title input')
let creator = document.querySelector('div.createur input')
let difficulte = document.querySelector('div.difficulte input')
let imageB = document.querySelector('div.ImageB input')
let imageC = document.querySelector('div.ImageC input')

let addA = document.querySelector('button.AddA')
let addB = document.querySelector('button.AddB')
let addC = document.querySelector('button.AddC')
let blocP = document.querySelector('button.BlocP')
let supprimerDernierBloc = document.querySelector('button.Supprimer')
let nombreDeBlocs = 0
let buttonTelecharger = document.querySelector('div.Telecharger')

let certainesInfos =  new Map

async function modifierUnFichier() 
{document.querySelector('input[type=file]')
document.querySelector('input[type=file]')
.addEventListener('change', (event) => {
    let file = event.target.files[0];
//Vérification de l"extension du fichier entrant.<----1ère sécurité
    if ( file.name[file.name.length-5]+file.name[file.name.length-4]+file.name[file.name.length-3]+file.name[file.name.length-2]+file.name[file.name.length-1] !='.jmpr') {
    alert('❌ Fichier non autorisé 🚫');
    }
    else {
    let lecteur = new FileReader();

    lecteur.onload = () => {
        let contenu = '';   
        contenu  = lecteur.result;
        document.querySelector("header").remove()
        document.querySelector("textarea").remove()
        let textarea = document.createElement('textarea')
        let telecharger = document.createElement("div")
        telecharger.setAttribute('class','Telecharger')
        telecharger.innerHTML= "<button>Telecharger</button>"
        document.querySelector("footer").replaceChildren(telecharger)
        textarea.innerText =JSON.stringify (contenu)
        document.querySelector(".textarea").replaceChildren(textarea)

        telecharger.onclick = ()=>{
    //Vérification du contenu du fichier entré.<----2ème sécurité        
    try {
        let final = 'd'
        let fenetreEdition = document.querySelector('textarea')
        final = JSON.parse(fenetreEdition.value)
    //La suite si le fichier respecte les normes        
    alert('Fichier valide ✅.')
       //Problème résolu avec Json.stringlify() mais on aimerait bien laisser pour voir les traces       
    if (final !="[object Object]")
    {let leBlob = new Blob([final], { type: 'text/jmpr' })
    let blobUrl = URL.createObjectURL(leBlob)

    let leLienDeTelechargement = document.createElement('a')
    leLienDeTelechargement.download = file.name
    leLienDeTelechargement.href = blobUrl

    document.body.append(leLienDeTelechargement)
    leLienDeTelechargement.click()
    leLienDeTelechargement.remove()
    URL.revokeObjectURL(blobUrl)
    } else {alert("Problème de télechargement/transformation")}
} catch (error) {
        alert('le fichier ne respecte pas le format JSON ⚠️. Veuillez le vérifier')
    }           
        }
};  
lecteur.readAsText(file);
}
});   }


function modifierOuCreer() 
{let buttonOn = document.querySelectorAll("button")


buttonOn.forEach(buttons => {
    buttons.onclick = () =>
    {//Créer un fichier
        document.querySelector("div.importer").remove()
        let telecharger = document.createElement("div")
        telecharger.setAttribute('class','Telecharger')
        telecharger.innerHTML= "<button>Telecharger</button>"
        document.querySelector(".contenue").append(telecharger)

        return manipulation()
    }
})

    modifierUnFichier()
}



let blocks = []
let infosAssets = []
nombreDeBlocs = blocks.length // Pas de malue, c"est défini en haut.

function manipulation () {   
    if (title.value != '' && creator.value!='' && difficulte.value!='')
      { let minimal = '{"title":"'+title.value+ '","creator":"'+creator.value+ '","difficulty":"'+difficulte.value+ '",'      
        certainesInfos.set('Contenu Minimal',minimal)     
    } else {
       alert('Veuillez remplir au moins les informations title; difficulty et creator pour continuer')
        return minimalRequis()
    }

    infosAssets = [imageB.value,imageC.value,melody.value] // C"est pour essayer de les retirer si elles sont vides
// Vérification du format lien, on pourait faire un partern en html mais on aime refléchir pour trouver comment les choses pourraient tourner derrière ces trucs que nous utilisons par défaut.
    if (imageB.value != ''){
        if (imageB.value > 11)
        {
            if ( imageB.value[0]+imageB.value[1]+imageB.value[2]+imageB.value[3]+imageB.value[4]+imageB.value[5]+imageB.value[6]+imageB.value[7] !='https://')
        {
            infosAssets[0]=''
        }
    } else {
        infosAssets[0]=''
    }
}

if (imageC.value != ''){
    if (imageC.value > 11)
    {
        if ( imageC.value[0]+imageC.value[1]+imageC.value[2]+imageC.value[3]+imageC.value[4]+imageC.value[5]+imageC.value[6]+imageC.value[7] !='https://')
    {
        infosAssets[1]=''
    }
} else {
    infosAssets[1]=''
}
}

if (melody.value != ''){
    if (melody.value > 11)
    {
        if ( melody.value[0]+melody.value[1]+melody.value[2]+melody.value[3]+melody.value[4]+melody.value[5]+melody.value[6]+melody.value[7] !='https://')
    {
        infosAssets[2]=''
    }
} else {
    infosAssets[2]=''
}
}

let assets = ['"B": "'+infosAssets[0]+'"','"C": "'+ infosAssets[1] +'"','"melody": "'+ infosAssets[2] +'"']

            let i=0
            while (i<3) {
                if (infosAssets[i]==''){
                    assets[i] = '"Non défini":"Valeur Invalide ❌"'
                }
                i=i+1
            }  
            assets = ' "assets": {'+assets[0]+','+assets[1]+','+assets[2]+'}'  
          
        certainesInfos.set('assets',assets)


    
    addA.onclick = () => {
        blocks.push('{"type":"A"}')
        return afficher()
    }
    addB.onclick = () =>{
        blocks.push('{"type":"B"}')
        return afficher()
    }
    addC.onclick = () =>{
        blocks.push('{"type":"C"}')
        return afficher()
    }

    blocP.onclick = () =>{
        let ecritureDuNiveau = certainesInfos.get('Contenu Minimal') + certainesInfos.get('assets') + ',"blocks":['+blocks+']}'
        certainesInfos.set('Personnalisation',ecritureDuNiveau)
        return personnaliser()
    }

    supprimerDernierBloc.onclick = () => {
        blocks= blocks.slice(0,blocks.length - 1)
        return afficher()
    }
    document.querySelector(".Telecharger button").onclick = ()=>{
        try {
            let toujoursTest = ""
            toujoursTest= JSON.parse(certainesInfos.get('Contenu'))
        } catch(erreur){alert(erreur)} // Pas possible que l'erreure se produise mais qu'on laisse les traces de nos reflexions
        telechargement()
    }
}

function minimalRequis() {
    let buttonOn = document.querySelectorAll("button")
    buttonOn.forEach(buttons => {
        buttons.onclick = () =>
        {  
            return manipulation()
      
        }
    })
}

function afficher() {
    let ecritureDuNiveau = certainesInfos.get('Contenu Minimal') + certainesInfos.get('assets') + ',"blocks":['+blocks+']}'

    certainesInfos.set('Contenu',ecritureDuNiveau)
    let textarea = document.createElement('pre')
    textarea.innerHTML = '<textarea disabled>'+certainesInfos.get('Contenu')+'</textarea>'
    document.querySelector("textarea").remove()
    document.querySelector("#textarea").append(textarea)
    
    let nombreCourantDeBlocks = document.createElement("p")
    nombreCourantDeBlocks.innerHTML = 'Nombre de blocs: ' + blocks.length 
    document.querySelector("div.Nombreblocs p").remove()
    document.querySelector("div.Nombreblocs").append(nombreCourantDeBlocks)
    return manipulation()
}

function personnaliser() {
    let textareaa = document.createElement('pre')
    textareaa.innerHTML = '<textarea autofocus>'+certainesInfos.get('Personnalisation') +'</textarea>'
    document.querySelector("textarea").remove()
    document.querySelector("#textarea").append(textareaa)
    addA.remove()
    addB.remove()
    addC.remove()
    blocP.remove()
    document.querySelector('div.Nombreblocs p').remove()
    document.querySelector('.Telecharger button').remove()
    supprimerDernierBloc.remove()
    buttonTelecharger.remove()
    let telecharger = document.createElement("div")
    telecharger.setAttribute('class','Telecharge')
    telecharger.innerHTML= "<button>Telecharger</button>"
    document.querySelector(".contenue").append(telecharger)

    telecharger.onclick = () => {
            let valeur = document.querySelector('textarea')
            try {
            let edite = ''

            edite = JSON.parse(valeur.value)
            certainesInfos.set('Contenu',edite)
        //La suite si le fichier respecte les normes 
        alert("Barrières passées. \n Le fichier est pret à l'emploi 🥲")           
    telechargement()
        }
        catch (error) {
            alert('Hupppppppp🤯 \n Le fichier ne respecte pas le format JSON, Revoyez svp🥸')
            certainesInfos.set('Personnalisation',valeur.value)
        }
    }
}

function telechargement () {
    // On a remarqué que c'est essentiel de rendre en string après le test de format pour pouvoir l'utiliser
   // (Pour qu'il passe le test d'intrusion au jeu 🥲)
    let leBlob = new Blob([ JSON.stringify(certainesInfos.get('Contenu'))], { type: 'text/jmpr' })
    let blobUrl = URL.createObjectURL(leBlob)

    let leLienDeTelechargement = document.createElement('a')
    leLienDeTelechargement.download = title.value+'.jmpr'
    leLienDeTelechargement.href = blobUrl

    document.body.append(leLienDeTelechargement)
    leLienDeTelechargement.click()
    leLienDeTelechargement.remove()
    URL.revokeObjectURL(blobUrl)
}
modifierOuCreer()