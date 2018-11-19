import * as esprima from 'esprima';

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
//Could be together, only logical separation.
const Expressions = {
    'Identifier' : parseIdentifier,
    'Literal' : parseLiteral,
    'BinaryExpression' : parseBinExpr,
    'LogicalExpression' : parseBinExpr,
    'UnaryExpression' : parseUnary,
    'MemberExpression' : parseMember,
    'UpdateExpression' : parseUnary
};

function parseIdentifier(Exp){
    return Exp.name;
}

function parseLiteral(Exp){
    return Exp.value.toString();
}

function parseBinExpr(Exp){
    let val, left, op, right;
    left = Expressions[Exp.left.type](Exp.left);
    right = Expressions[Exp.right.type](Exp.right);
    op = ' ' + Exp.operator + ' ';
    val = left + op + right;
    return val;
}

function parseUnary(Exp){
    let op, val;
    op = Exp.operator;
    val = Expressions[Exp.argument.type](Exp.argument);
    return val + op;
}

function parseMember(Exp) {
    let arr, i, val;
    arr = Expressions[Exp.object.type](Exp.object);
    i = Expressions[Exp.property.type](Exp.property);
    val = arr + '[' + i + ']';
    return val;
}


function parseExp(Body){
    return Functions[Body.expression.type](Body.expression);
}

function parseAssign(Body){
    let Table = [];
    let type = Body.type;
    let name = Expressions[Body.left.type](Body.left);
    let val = Expressions[Body.right.type](Body.right);
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
            val = Expressions[Body.declarations[i].init.type](Body.declarations[i].init);
        let row = new TableRow(line, type, name, null, val);
        Table.push(row);
    }
    return Table;
}

function parseIf(Body){
    let Table = [];
    let type = Body.type;
    let cond = Expressions[Body.test.type](Body.test);
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
    let cond = Expressions[Body.test.type](Body.test);
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

    let initRow = Functions[Body.init.type](Body.init);
    let init = initRow[0].Name + '=' + initRow[0].Val;
    let test = Expressions[Body.test.type](Body.test);
    let update = Expressions[Body.update.type](Body.update);
    let cond = init + ' ; ' + test + ' ; ' + update;
    let row = new TableRow(line, type, null, cond, null);
    Table.push(row);
    Table = Table.concat(loopBody(Body.body));
    return Table;

}

function parseRet(Body){
    let Table = [];
    let type = Body.type;
    let val = Expressions[Body.argument.type](Body.argument);
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
