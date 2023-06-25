const fs = require('fs')
const xml2js = require('xml2js');

var parser = new xml2js.Parser();

class ParsedLibrary {
    constructor(parsedLibrary) {
        this.parsedLibrary = parsedLibrary
    }

    findContent(contentID) {
        for (let content of this.parsedLibrary.library.content) {
            if (content['$']['content-id'] === contentID) {
                return content
            }
        }
        return null;
    }

    extract(rootContent, collection) {
        if (rootContent['content-links']) {
            collection.push(rootContent)
            let contentCollection = rootContent['content-links']
            for (let index in contentCollection[0]['content-link']) {
                let childContent = this.findContent(contentCollection[0]['content-link'][index]['$']['content-id'])
                this.extract(childContent, collection)
            }
        } else {
            collection.push(rootContent)

        }
    }
}

function initExtract(someKindOfObject) {
    let pl = new ParsedLibrary(someKindOfObject)
    let root = pl.findContent('newsletter-LP')
    let contentCollection = []
    if (root) {
        pl.extract(root, contentCollection)
    }
    writeFinalFile(contentCollection)
}

function writeFinalFile(obj) {
    var builder = new xml2js.Builder();

    let finalObject = {
        library: {
            $: {
                'xmlns': "http://www.demandware.com/xml/impex/library/2006-10-31",
                'library-id': "YK_Library"
            },
            content: obj
        }
    }
    let xml = builder.buildObject(finalObject)
    fs.writeFile(`${__dirname}/output/output.xml`, xml, (err) => {
        if (err) {
            console.log(err); // clog
        } else {
            console.log(`Huge success`); // clog
        }
    })
}


fs.readFile(`${__dirname}/input/LE_NOM_DE_VOTRE_FICHIER_ICI`, (err, data) => {
    parser.parseString(data, (err, result) => {
        initExtract(result)
    })
})