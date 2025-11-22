// Backend Apps Script para submissão de temas de monografia (Etapa 1)
// Usa planilha e aba pré-existentes para gravar os dados recebidos via doPost

const SPREADSHEET_ID = '1rTmgTuGU5nnleWYlysuWRGRDlT18Dm_QcWUbJvTzFSk';
const SHEET_NAME = 'Dados';

const ACTION_LIST_SUBMISSIONS = 'listarSubmissoes';
const ACTION_UPDATE_REVIEW = 'atualizarParecerSupervisor';

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

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  const { contents, type } = e.postData;

  if (type === 'application/json') {
    try {
      return JSON.parse(contents);
    } catch (err) {
      return {};
    }
  }

  if (type === 'application/x-www-form-urlencoded') {
    return contents
      .split('&')
      .map(function (pair) {
        const [key, value] = pair.split('=');
        return [decodeURIComponent(key || ''), decodeURIComponent(value || '')];
      })
      .reduce(function (acc, curr) {
        const [key, value] = curr;
        if (key) {
          acc[key] = value;
        }
        return acc;
      }, {});
  }

  return {};
}

function getAction(e, parsedBody) {
  const params = (e && e.parameter) || {};
  if (params.action) {
    return params.action;
  }

  if (parsedBody && parsedBody.action) {
    return parsedBody.action;
  }

  return '';
}

function handleListSubmissions() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return jsonResponse(200, []);
  }

  const data = sheet.getRange(2, 1, lastRow - 1, HEADER.length).getValues();

  const submissions = data.map(function (row, index) {
    return {
      timestamp: row[0] instanceof Date ? row[0].toISOString() : row[0],
      nome: row[1],
      numeroEstudante: row[2],
      curso: row[4],
      tituloTema: row[5],
      supervisor: row[8],
      parecer: row[9],
      linha: index + 2
    };
  });

  return jsonResponse(200, submissions);
}

function handleUpdateSubmission(params, body) {
  const targetLine = Number((params && params.linha) || (body && body.linha));
  const supervisor = (params && params.supervisor) || (body && body.supervisor) || '';
  const parecer = (params && params.parecer) || (body && body.parecer) || '';

  if (!targetLine || targetLine < 2) {
    return jsonResponse(400, { sucesso: false, mensagem: 'Linha inválida.' });
  }

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (targetLine > lastRow) {
    return jsonResponse(404, { sucesso: false, mensagem: 'Linha não encontrada.' });
  }

  sheet.getRange(targetLine, 9).setValue(supervisor);
  sheet.getRange(targetLine, 10).setValue(parecer);

  return jsonResponse(200, { sucesso: true });
}

/**
 * Handler para submissões via POST.
 * Espera um corpo JSON com os campos obrigatórios definidos em validatePayload.
 */
function doPost(e) {
  try {
    const parsedBody = parseRequestBody(e);
    const action = getAction(e, parsedBody);

    if (action === ACTION_UPDATE_REVIEW) {
      return handleUpdateSubmission(e && e.parameter, parsedBody);
    }

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

function doGet(e) {
  try {
    const parsedBody = parseRequestBody(e);
    const action = getAction(e, parsedBody);

    if (action === ACTION_LIST_SUBMISSIONS) {
      return handleListSubmissions();
    }

    return jsonResponse(404, { sucesso: false, mensagem: 'Rota não encontrada.' });
  } catch (err) {
    return jsonResponse(400, { sucesso: false, mensagem: err.message || 'Erro ao processar requisição.' });
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
