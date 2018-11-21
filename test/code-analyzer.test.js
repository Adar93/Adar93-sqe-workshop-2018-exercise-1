import assert from 'assert';
import {tableCreation} from '../src/js/code-analyzer';

describe('The table parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('')),
            '[]'
        );
    });
});

describe('Let parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('let a = 1;')),
            '[{"Line":1,"Type":"VariableDeclarator","Name":"a","Cond":null,"Val":"1"}]'
        );
    });
    it('is parsing multiple variable declaration correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('let a, b = 0, c;')),
            '[{"Line":1,"Type":"VariableDeclarator","Name":"a","Cond":null,"Val":null},{"Line":1,"Type":"VariableDeclarator","Name":"b","Cond":null,"Val":"0"},{"Line":1,"Type":"VariableDeclarator","Name":"c","Cond":null,"Val":null}]'
        );
    });
});

describe('Assign parser', () => {
    it('is parsing a simple Assignment correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('a = b + c;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"a","Cond":null,"Val":"b + c"}]'
        );
    });
});

describe('Func parser', () => {
    it('is parsing a simple function correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('function func(){}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"func","Cond":null,"Val":null}]'
        );
    });
    it('is parsing a simple function correctly with params and body', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('function func(a, b, c){\n' +
                'a = b + c\n' +
                '}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"func","Cond":null,"Val":null},{"Line":1,"Type":"Param","Name":"a","Cond":null,"Val":null},{"Line":1,"Type":"Param","Name":"b","Cond":null,"Val":null},{"Line":1,"Type":"Param","Name":"c","Cond":null,"Val":null},{"Line":2,"Type":"AssignmentExpression","Name":"a","Cond":null,"Val":"b + c"}]'        );
    });
});

describe('While parser', () => {
    it('is parsing a while loop correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('while (x < y) {\n' +
                'x = x + 1;\n' +
                'y = y / 2;\n' +
                '}')),
            '[{"Line":1,"Type":"WhileStatement","Name":null,"Cond":"x < y","Val":null},{"Line":2,"Type":"AssignmentExpression","Name":"x","Cond":null,"Val":"x + 1"},{"Line":3,"Type":"AssignmentExpression","Name":"y","Cond":null,"Val":"y / 2"}]'
        );
    });
});

describe('For parser', () => {
    it('is parsing a for loop correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('let i,x=10,y=100;\n' +
                'for (i=0;i<5;i++) {\n' +
                'x = x + 1;\n' +
                'y = y / 2;\n' +
                '}')),
            '[{"Line":1,"Type":"VariableDeclarator","Name":"i","Cond":null,"Val":null},{"Line":1,"Type":"VariableDeclarator","Name":"x","Cond":null,"Val":"10"},{"Line":1,"Type":"VariableDeclarator","Name":"y","Cond":null,"Val":"100"},{"Line":2,"Type":"ForStatement","Name":null,"Cond":"i = 0 ; i < 5 ; i++","Val":null},{"Line":3,"Type":"AssignmentExpression","Name":"x","Cond":null,"Val":"x + 1"},{"Line":4,"Type":"AssignmentExpression","Name":"y","Cond":null,"Val":"y / 2"}]'
        );
    });
    it('is parsing a for loop with let correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('for (let i=0;i<5;i++) {\n' +
                '}')),
            '[{"Line":1,"Type":"ForStatement","Name":null,"Cond":"let i = 0 ; i < 5 ; i++","Val":null}]'
        );
    });
});

describe('If parser', () => {
    it('is parsing an if statement correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('if (x < y){\n' +
                'x = x + 1;\n' +
                'y = y / 2;\n' +
                '}')),
            '[{"Line":1,"Type":"IfStatement","Name":null,"Cond":"x < y","Val":null},{"Line":2,"Type":"AssignmentExpression","Name":"x","Cond":null,"Val":"x + 1"},{"Line":3,"Type":"AssignmentExpression","Name":"y","Cond":null,"Val":"y / 2"}]'
        );
    });
});
describe('If parser', () => {
    it('is parsing an else-if statement correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('if (X < V[mid])\n' +
                'high = mid - 1;\n' +
                'else if (X > V[mid])\n' +
                'low = mid + 1;\n' +
                'else\n' +
                'low = high')),
            '[{"Line":1,"Type":"IfStatement","Name":null,"Cond":"X < V[mid]","Val":null},{"Line":2,"Type":"AssignmentExpression","Name":"high","Cond":null,"Val":"mid - 1"},{"Line":3,"Type":"IfStatement","Name":null,"Cond":"X > V[mid]","Val":null},{"Line":4,"Type":"AssignmentExpression","Name":"low","Cond":null,"Val":"mid + 1"},{"Line":6,"Type":"AssignmentExpression","Name":"low","Cond":null,"Val":"high"}]'
        );
    });
});

describe('Return parser', () => {
    it('is parsing a return statement correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('function a(){\n' +
                '    return -1;\n' +
                '}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"a","Cond":null,"Val":null},{"Line":2,"Type":"ReturnStatement","Name":null,"Cond":null,"Val":"-1"}]'
        );
    });
});

describe('The table parser', () => {
    it('is parsing a complex example correctly', () => {
        assert.deepEqual(
            JSON.stringify(tableCreation('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;}\n' +
                '    return -1;}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"binarySearch","Cond":null,"Val":null},{"Line":1,"Type":"Param","Name":"X","Cond":null,"Val":null},{"Line":1,"Type":"Param","Name":"V","Cond":null,"Val":null},{"Line":1,"Type":"Param","Name":"n","Cond":null,"Val":null},{"Line":2,"Type":"VariableDeclarator","Name":"low","Cond":null,"Val":null},{"Line":2,"Type":"VariableDeclarator","Name":"high","Cond":null,"Val":null},{"Line":2,"Type":"VariableDeclarator","Name":"mid","Cond":null,"Val":null},{"Line":3,"Type":"AssignmentExpression","Name":"low","Cond":null,"Val":"0"},{"Line":4,"Type":"AssignmentExpression","Name":"high","Cond":null,"Val":"n - 1"},{"Line":5,"Type":"WhileStatement","Name":null,"Cond":"low <= high","Val":null},{"Line":6,"Type":"AssignmentExpression","Name":"mid","Cond":null,"Val":"(low + high) / 2"},{"Line":7,"Type":"IfStatement","Name":null,"Cond":"X < V[mid]","Val":null},{"Line":8,"Type":"AssignmentExpression","Name":"high","Cond":null,"Val":"mid - 1"},{"Line":9,"Type":"IfStatement","Name":null,"Cond":"X > V[mid]","Val":null},{"Line":10,"Type":"AssignmentExpression","Name":"low","Cond":null,"Val":"mid + 1"},{"Line":12,"Type":"ReturnStatement","Name":null,"Cond":null,"Val":"mid"},{"Line":13,"Type":"ReturnStatement","Name":null,"Cond":null,"Val":"-1"}]'
        );
    });
});
