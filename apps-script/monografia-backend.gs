// Backend Apps Script para submissão de temas de monografia (Etapa 1)
// - Cria a planilha caso não exista
// - Recebe submissões via doPost e grava numa folha "Temas"
// - Responde em JSON

const CONFIG = {
  spreadsheetName: 'SubmissoesTemasMonografia',
  sheetName: 'Temas',
  sheetIdProperty: 'MONOGRAFIA_SHEET_ID'
};

/**
 * Obtém ou cria a planilha e a folha necessária.
 * A referência da planilha fica guardada em ScriptProperties para evitar múltiplas criações.
 */
function getOrCreateSheet() {
  const props = PropertiesService.getScriptProperties();
  const storedId = props.getProperty(CONFIG.sheetIdProperty);
  let spreadsheet;

  if (storedId) {
    try {
      spreadsheet = SpreadsheetApp.openById(storedId);
    } catch (err) {
      // Se não conseguir abrir (foi apagada?), vamos criar uma nova.
      spreadsheet = null;
    }
  }

  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.create(CONFIG.spreadsheetName);
    props.setProperty(CONFIG.sheetIdProperty, spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
    setHeader(sheet);
  }

  return sheet;
}

/**
 * Define o cabeçalho padrão da folha.
 */
function setHeader(sheet) {
  const header = [
    'Timestamp',
    'Nome do estudante',
    'Número do estudante',
    'Curso',
    'Email',
    'Tema proposto',
    'Resumo/justificativa',
    'Estado',
    'Supervisor',
    'Observações do gestor'
  ];
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
}

/**
 * Handler para submissão do tema (POST).
 * Espera um corpo JSON com os campos principais do formulário.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Corpo da requisição vazio ou inválido.');
    }

    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    const newRow = [
      new Date(),
      payload.nome || '',
      payload.numeroEstudante || '',
      payload.curso || '',
      payload.email || '',
      payload.tema || '',
      payload.resumo || '',
      'Pendente', // Estado inicial
      '', // Supervisor ainda não atribuído
      '' // Observações do gestor
    ];

    sheet.appendRow(newRow);

    const protocolo = `${sheet.getSheetName()}-${sheet.getLastRow() - 1}`; // simples identificador

    return jsonResponse(201, {
      sucesso: true,
      mensagem: 'Submissão registada com sucesso.',
      protocolo,
      estado: 'Pendente'
    });
  } catch (err) {
    return jsonResponse(400, {
      sucesso: false,
      mensagem: err.message || 'Erro ao processar submissão.'
    });
  }
}

/**
 * Cria uma resposta JSON com o status informado.
 */
function jsonResponse(statusCode, data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output.setResponseCode(statusCode);
}
