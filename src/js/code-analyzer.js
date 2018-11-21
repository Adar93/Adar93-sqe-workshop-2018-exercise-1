import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

function TableRow (line, type, name, cond, val){
    return {
        Line: line,
        Type: type,
        Name: name,
        Cond: cond,
        Val: val
    };
}

const Functions = {

    'IfStatement' : parseIf,
    'FunctionDeclaration' : parseFunc,
    'VariableDeclaration' : parseLet,
    'WhileStatement' : parseWhile,
    'ReturnStatement' : parseRet,
    'ExpressionStatement' : parseExp,
    'AssignmentExpression' : parseAssign,
    'BlockStatement': loopBody,
    'ForStatement' : parseFor
};

function parseExp(Body){
    return Functions[Body.expression.type](Body.expression);
}

function parseAssign(Body){
    let Table = [];
    let type = Body.type;
    let name = escodegen.generate(Body.left);
    let val = escodegen.generate(Body.right);
    let line = Body.loc.start.line;
    let row = new TableRow(line, type, name ,null ,val );
    Table.push(row);
    return Table;
}

function parseLet(Body){
    let Table = [];
    let i;
    for (i = 0; i<Body.declarations.length; i++) {
        let type = Body.declarations[i].type;
        let name = Body.declarations[i].id.name;
        let line = Body.declarations[i].loc.start.line;
        let val = null;
        if (Body.declarations[i].init != null)
            val = escodegen.generate(Body.declarations[i].init);
        let row = new TableRow(line, type, name, null, val);
        Table.push(row);
    }
    return Table;
}

function parseIf(Body){
    let Table = [];
    let type = Body.type;
    let cond = escodegen.generate(Body.test);
    let line = Body.loc.start.line;
    let row = new TableRow(line, type, null, cond , null );
    Table.push(row);
    Table = Table.concat(Functions[Body.consequent.type](Body.consequent));
    if (Body.alternate != null){
        Table = Table.concat(Functions[Body.alternate.type](Body.alternate));
    }
    return Table;
}

function parseFunc(Body){
    let Table = [];
    let type = Body.type;
    let name = Body.id.name;
    let line = Body.loc.start.line;
    let row = new TableRow(line, type, name, null, null);
    Table.push(row);
    //Parse function parameters
    let i;
    type = 'Param';
    for (i = 0; i<Body.params.length; i++){
        name = Body.params[i].name;
        line = Body.params[i].loc.start.line;
        let row = new TableRow(line, type, name, null, null);
        Table.push(row);
    }
    //Parse function body
    Table = Table.concat(loopBody(Body.body));
    return Table;
}

function parseWhile(Body){
    let Table = [];
    let type = Body.type;
    let cond = escodegen.generate(Body.test);
    let line = Body.loc.start.line;
    let row = new TableRow(line, type, null, cond, null);
    Table.push(row);
    Table = Table.concat(loopBody(Body.body));
    return Table;
}

function parseFor(Body){
    let Table = [];
    let line = Body.loc.start.line;
    let type = Body.type;
    let init = escodegen.generate(Body.init);
    if(init.substr(init.length - 1) === ';'){
        init = init.substr(0,init.length - 1);
    }
    let test = escodegen.generate(Body.test);
    let update = escodegen.generate(Body.update);
    let cond = init + ' ; ' + test + ' ; ' + update;
    let row = new TableRow(line, type, null, cond, null);
    Table.push(row);
    Table = Table.concat(loopBody(Body.body));
    return Table;

}

function parseRet(Body){
    let Table = [];
    let type = Body.type;
    let val = escodegen.generate(Body.argument);
    let line = Body.loc.start.line;
    let row = new TableRow(line, type, null, null, val);
    Table.push(row);
    return Table;
}

function loopBody(parsedCode){
    let Table = [];
    let i;
    for (i = 0; i<parsedCode.body.length; i++){
        Table = Table.concat(Functions[parsedCode.body[i].type](parsedCode.body[i]));
    }
    return Table;
}

function tableCreation(codeToParse){
    let parsedCode = parseCode(codeToParse);
    return loopBody(parsedCode);
}

export {parseCode, tableCreation};
