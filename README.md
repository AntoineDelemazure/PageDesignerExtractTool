# PageDesignerExtractTool
Pour isoler en un instant un page Page Designer depuis un fichier library issu du BM

## Utilisation
1. Cloner le repo
2. ouvrir une console dans le dossier du repo
2. npm i
3. node index.js adresse_de_l_export_a_parcourir ID_de_la_page_a_isoler

## Renommage des IDs
Il faut croire que la boite noire n'est pas particulièrement douée pour faire des UUID vraiment unique, et il arrive que la page s'importe très mal à cause lien multiple vers un composant.
Aussi existe t-il une fonction pour renommer chaque ID afin de s'assurer que cette situation ne se présente pas. Ajoutez simplement le troisième argument 'y' pour l'activer
Ex : node index.js adresse_de_l_export_a_parcourir ID_de_la_page_a_isoler y
