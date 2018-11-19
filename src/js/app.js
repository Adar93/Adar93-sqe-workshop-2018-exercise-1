import $ from 'jquery';
import {tableCreation} from './code-analyzer';

function updateTable(row){
    let ans = '<tr>';
    ans = ans + '<td>' + row.Line + '</td>';
    ans = ans + '<td>' + row.Type + '</td>';
    if (row.Name != null) ans = ans + '<td>' + row.Name + '</td>';
    else ans = ans + '<td>' + '</td>';
    if (row.Cond != null) ans = ans + '<td>' + row.Cond + '</td>';
    else ans = ans + '<td>' + '</td>';
    if (row.Val != null) ans = ans + '<td>' + row.Val + '</td>';
    else ans = ans + '<td>' + '</td>';
    ans = ans + '</tr>';
    return ans;

}

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        //let parsedCode = tableCreation(codeToParse);
        //$('#parsedCode').val(JSON.stringify(parsedCode));
        let tab = tableCreation(codeToParse);
        let HTMLtab = document.getElementById('tableBody');
        HTMLtab.innerHTML = '';
        let i;
        for(i = 0 ; i <= tab.length; i++){
            let row = updateTable(tab[i]);
            HTMLtab.innerHTML = HTMLtab.innerHTML + row;
        }
    });
});


