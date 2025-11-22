// Backend Apps Script para submissão de temas de monografia (Etapa 1)
// Usa planilha e aba pré-existentes para gravar os dados recebidos via doPost

const SPREADSHEET_ID = '1FqSLZfO0733h_JZQH6hq19H6YqbSESfx';
const SHEET_NAME = 'Dados';

const HEADER = [
  'Timestamp',
  'Nome',
  'NumeroEstudante',
  'Contacto',
  'Curso',
  'TituloTema',
  'DescricaoTema',
  'Estado',
  'Supervisor',
  'Parecer'
];

/**
 * Obtém a aba "Dados" da planilha configurada.
 * Caso a aba esteja vazia, define o cabeçalho padrão.
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('A aba "Dados" não foi encontrada na planilha informada.');
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
  }

  return sheet;
}

/**
 * Valida se todos os campos obrigatórios estão presentes no payload.
 */
function validatePayload(payload) {
  const requiredFields = [
    'Nome',
    'NumeroEstudante',
    'Contacto',
    'Curso',
    'TituloTema',
    'DescricaoTema'
  ];

  const missing = requiredFields.filter(function (field) {
    const value = payload[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length > 0) {
    throw new Error('Campos obrigatórios em falta: ' + missing.join(', '));
  }
}

/**
 * Handler para submissões via POST.
 * Espera um corpo JSON com os campos obrigatórios definidos em validatePayload.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Corpo da requisição vazio ou inválido.');
    }

    const payload = JSON.parse(e.postData.contents);
    validatePayload(payload);

    const sheet = getSheet();

    const row = [
      new Date(),
      payload.Nome,
      payload.NumeroEstudante,
      payload.Contacto,
      payload.Curso,
      payload.TituloTema,
      payload.DescricaoTema,
      'Em análise',
      '',
      ''
    ];

    sheet.appendRow(row);

    return jsonResponse(201, {
      sucesso: true,
      mensagem: 'Submissão registada com sucesso.',
      estado: 'Em análise'
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
