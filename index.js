const fs = require('fs')
const xml2js = require('xml2js');
const uuid = require('uuid')

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

    extract(rootContent, collection, newUUID) {
        let oldUUID = rootContent['$']['content-id']
        let replacingUUID = null;
        if (newUUID && typeof newUUID === 'string') { // renaming is involved AND we're not at the root
            rootContent['$']['content-id'] = newUUID;
            console.log(`Je m'appelais ${oldUUID}, je suis désormais ${rootContent['$']['content-id']}`); // clog
        }
        if (rootContent['content-links']) {
            collection.push(rootContent)
            let contentCollection = rootContent['content-links']
            for (let index in contentCollection[0]['content-link']) {
                let childContent = this.findContent(contentCollection[0]['content-link'][index]['$']['content-id'])
                if (newUUID) {
                    replacingUUID = uuid.v4()
                    contentCollection[0]['content-link'][index]['$']['content-id'] = replacingUUID;
                }
                this.extract(childContent, collection, replacingUUID)
            }
        } else {
            collection.push(rootContent)

        }
    }
}

function initExtract(someKindOfObject, contentID, renameContents) {
    let pl = new ParsedLibrary(someKindOfObject)
    let root = pl.findContent(contentID)
    let contentCollection = []
    if (root) {
        pl.extract(root, contentCollection, renameContents)
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


var cmdLineArgs = process.argv.slice(2)
if (cmdLineArgs.length >= 2) {
    fs.readFile(cmdLineArgs[0], (err, data) => {
        parser.parseString(data, (err, result) => {
            initExtract(result, cmdLineArgs[1], cmdLineArgs.length > 2 && cmdLineArgs[2] === 'y')
        })
    })
} else {
    console.log(`Two arguments expected : source and contentID`); // clog
}