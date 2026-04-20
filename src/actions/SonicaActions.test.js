import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import store from '../store/index'
import {
  PutLogout,
  PutAdminActive,
  GetReportGenerator,
  PostAcknowledge,
  GetLogOutTime,
  GetImage,
  PostApplyForm,
  PostApplyCommand,
  PostWriteArg,
  GetComponentsCurrent,
  GetComponentsDelta,
  PostTooltiperAck,
  GetHistoryTime,

} from './SonicaActions'
import { encript } from '@/mixins/encript'
import moment from 'moment'

const mockFetch = vi.fn()
global.fetch = mockFetch

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// vi.spyOn(store, 'dispatch').mockImplementation(() => Promise.resolve())
vi.mock('@/store', () => ({
  default: {
    getters: {
      GetDefaultIp: 'example.com'
    },
    dispatch: vi.fn()
  }
}))

let callback


beforeEach(() => {
  localStorage.clear()
  mockFetch.mockReset();
  vi.clearAllMocks()

  localStorage.setItem('token', 'Bearer-ABC123');
  localStorage.setItem('userId', '123');

  callback = vi.fn()
})

afterEach(() => {
  // vi.clearAllMocks()  
})

describe('api/table/out', () => {
  it('status response → 200', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve({}),
    });

    await PutLogout(callback);

    const expectedUrl = `http://example.com/api/table/out/123`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      { method: 'PUT', headers: { Authorization: 'Bearer-ABC123' } }
    );

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await PutLogout(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');

  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce('', { status: 500 });

    await PutLogout(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const err = new Error('Network error');
    mockFetch.mockRejectedValueOnce(err);

    await PutLogout(callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', err.message);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/table/active', () => {

  it('status response → 200', async () => {
    const mockData = { status: 'active' };
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockData),
      statusText: 'OK'
    });

    await PutAdminActive(callback);

    const expectedUrl = `http://example.com/api/table/active/123`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'PUT',
        headers: { Authorization: 'Bearer-ABC123' }
      })
    );

    expect(callback).toHaveBeenCalledWith(true, 'active');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await PutAdminActive(callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await PutAdminActive(callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await PutAdminActive(callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/report/pdf', () => {
  const mockMas = [
    { name: 'field1', value: 'value1' },
    { name: 'field2', value: 'value2' }
  ];
  const expectedBody = {
    field1: 'value1',
    field2: 'value2'
  };
  const pathName = 'test-report';
  const createObjectURL = vi.fn(() => 'blob:url');
  const mockLink = { href: '', download: '', click: vi.fn(), remove: vi.fn() };

  it('status response → 200', async () => {
    global.window.URL.createObjectURL = createObjectURL;
    document.createElement = vi.fn(() => mockLink);
    document.body.appendChild = vi.fn();

    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      blob: () => new Blob(['data']),
      statusText: 'OK'
    });

    await GetReportGenerator(mockMas, pathName, callback);

    expect(mockFetch).toHaveBeenCalledWith(
      `http://example.com/api/report/pdf/${pathName}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer-ABC123' },
        body: JSON.stringify(expectedBody)
      }
    );

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(new Blob(['data']));
    expect(callback).toHaveBeenCalledWith(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      blob: () => Promise.resolve(new Blob())
    });

    await GetReportGenerator(mockMas, pathName, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      blob: () => Promise.resolve(new Blob())
    });

    await GetReportGenerator(mockMas, pathName, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await GetReportGenerator(mockMas, pathName, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/nodes/footer/query/acknowledge', () => {
  const testId = 'test-id-123';
  it('status response → 200', async () => {
    const mockData = { status: 'acknowledged' };
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockData),
      statusText: 'OK'
    });

    await PostAcknowledge(testId, callback);

    const expectedUrl = `http://example.com/api/nodes/footer/widget/6MXB7RKGFTT5RNKE/query/acknowledge`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers),
        body: `[${testId}]`
      })
    );

    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer-ABC123' );

    expect(callback).toHaveBeenCalledWith(true, 'acknowledged');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await PostAcknowledge(testId, callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');

  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await PostAcknowledge(testId, callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await PostAcknowledge(testId, callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/table/time', () => {
  const mockLogoutTime = '2023-12-31T23:59:59Z';

  it('status response → 200', async () => {
    const mockData = { userLogOutClient: mockLogoutTime };
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockData),
      statusText: 'OK'
    });

    await GetLogOutTime(callback);

    const expectedUrl = `http://example.com/api/table/time`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers)
      })
    );

    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Content-Type')).toBe('application/json');

    expect(callback).toHaveBeenCalledWith(true, mockLogoutTime);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await GetLogOutTime(callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');

  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await GetLogOutTime(callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await GetLogOutTime(callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/resources', () => {
  const ninjaResourceId = 'image-123';
  const token = 'Bearer-ABC123';
  const mockImageUrl = 'blob:http://localhost/test-image';

  let originalCreateObjectURL;

  beforeEach(() => {
    originalCreateObjectURL = window.URL.createObjectURL;
    window.URL.createObjectURL = vi.fn(() => mockImageUrl);
  });

  afterEach(() => {
    window.URL.createObjectURL = originalCreateObjectURL;
  });

  it('status response → 200', async () => {
    const mockBlob = new Blob(['image data'], { type: 'image/png' });
    
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      blob: () => Promise.resolve(mockBlob),
      statusText: 'OK'
    });

    await GetImage(ninjaResourceId, callback);

    const expectedUrl = `http://example.com/api/resources/${ninjaResourceId}`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Authorization': token,
          'Accept': 'image/*'
        }
      })
    );

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(callback).toHaveBeenCalledWith(null, {
      url: mockImageUrl,
      blob: mockBlob
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await GetImage(ninjaResourceId, callback);

    expect(callback).toHaveBeenCalledWith(
      expect.any(Error),
      null
    );
    
    const errorArg = callback.mock.calls[0][0];
    // expect(errorArg.message).toBe('Ошибка загрузки изображения: 401 Bad Request');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await GetImage(ninjaResourceId, callback);

    expect(callback).toHaveBeenCalledWith(
      expect.any(Error),
      null
    );
    
    const errorArg = callback.mock.calls[0][0];
    // expect(errorArg.message).toBe('Ошибка загрузки изображения: 500 Internal Server Error');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await GetImage(ninjaResourceId, callback);

    expect(callback).toHaveBeenCalledWith(error, null);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('query/apply-form', () => {
  const token = 'Bearer-ABC123';
  const windowPath = 'test-window';
  const widgetName = 'test-widget';
  const mockBody = { field1: 'value1', field2: 'value2' };

  afterEach(() => {
    delete global.encript;
  });

  it('status response → 200 with success', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({})
    });

    await PostApplyForm(windowPath, widgetName, mockBody, callback);

    const expectedUrl = `http://example.com/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/apply-form`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers),
        body: JSON.stringify(mockBody)
      })
    );

    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe(token);

    expect(call[1].body).toBe(JSON.stringify(mockBody));

    expect(callback).toHaveBeenCalledWith(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 400', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 400,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await PostApplyForm(windowPath, widgetName, mockBody, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '400 Bad Request');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await PostApplyForm(windowPath, widgetName, mockBody, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await PostApplyForm(windowPath, widgetName, mockBody, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('query/apply-command', () => {
  const windowPath = 'test-window';
  const widgetName = 'test-widget';
  const mockBody = { field1: 'value1', field2: 'value2' };

  it('status response → 200', async () => {
    const mockResponse = {
      resultData: {
        description: 'Command executed successfully'
      }
    };
    
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve(mockResponse)
    });

    await PostApplyCommand(windowPath, widgetName, mockBody, callback);

    const expectedUrl = `http://example.com/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/apply-command`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers),
        body: JSON.stringify(mockBody)
      })
    );

    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer-ABC123');

    expect(call[1].body).toBe(JSON.stringify(mockBody));

    expect(callback).toHaveBeenCalledWith('Command executed successfully');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    const mockResponse = {
      errorDetails: 'Invalid command parameters'
    };
    
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve(mockResponse)
    });

    await PostApplyCommand(windowPath, widgetName, mockBody, callback);

    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    const mockResponse = {
      someData: 'test'
    };
    
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve(mockResponse)
    });

    await PostApplyCommand(windowPath, widgetName, mockBody, callback);

    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await PostApplyCommand(windowPath, widgetName, mockBody, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('query/write-arg', () => {
  const windowPath = 'test-window';
  const widgetName = 'test-widget';
  const mockBody = { field1: 'value1', field2: 'value2' };
 
  it('status response → 200', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({})
    });

    await PostWriteArg(windowPath, widgetName, mockBody, callback);

    const expectedUrl = `http://example.com/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/write-arg`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers),
        body: JSON.stringify(mockBody)
      })
    );

    // Проверяем заголовки
    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer-ABC123');

    // Проверяем тело запроса
    expect(call[1].body).toBe(JSON.stringify(mockBody));

    expect(callback).toHaveBeenCalledWith(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await PostWriteArg(windowPath, widgetName, mockBody, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await PostWriteArg(windowPath, widgetName, mockBody, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await PostWriteArg(windowPath, widgetName, mockBody, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/nodes/*/current', () => {
  const componentName = 'test-component';

  it('status response → 200', async () => {
    const mockData = { value: 'test-value', status: 'active' };
    
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve(mockData)
    });

    await GetComponentsCurrent(componentName, callback);

    const expectedUrl = `http://example.com/api/nodes/${componentName}/current`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: 'Bearer-ABC123' },
      })
    );

    expect(callback).toHaveBeenCalledWith(true, mockData);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await GetComponentsCurrent(componentName, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await GetComponentsCurrent(componentName, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await GetComponentsCurrent(componentName, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/nodes/*/delta/0/*', () => {
  const componentName = 'test-component';
  const tickValue = 12345;

  it('status response → 200', async () => {
    const mockData = { delta: 'test-delta', timestamp: '2023-01-01' };
    
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve(mockData)
    });

    await GetComponentsDelta(componentName, tickValue, callback);

    const expectedUrl = `http://example.com/api/nodes/${componentName}/delta/0/${tickValue}`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers)
      })
    );

    // Проверяем заголовки
    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Authorization')).toBe('Bearer-ABC123');
    expect(headers.get('Content-Type')).toBeNull(); // Не должно быть Content-Type для GET

    expect(callback).toHaveBeenCalledWith(true, mockData);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await GetComponentsDelta(componentName, tickValue, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');
    expect(callback).toHaveBeenCalledWith(false, '');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await GetComponentsDelta(componentName, tickValue, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false, '');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await GetComponentsDelta(componentName, tickValue, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/nodes/*/widget/*/query/*-acknowledge', () => {
  const windowPath = 'test-window';
  const widgetName = 'test-widget';
  const widgetType = 'alarm';
  const testUserId = '123';


  it('status response → 200', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({})
    });

    await PostTooltiperAck(windowPath, widgetName, widgetType, callback);

    const expectedUrl = `http://example.com/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/${widgetType}-acknowledge/${testUserId}`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers)
      })
    );

    // Проверяем заголовки
    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Authorization')).toBe('Bearer-ABC123');
    expect(headers.get('Content-Type')).toBeNull(); // Не должно быть Content-Type для GET

    expect(callback).toHaveBeenCalledWith(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await PostTooltiperAck(windowPath, widgetName, widgetType, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await PostTooltiperAck(windowPath, widgetName, widgetType, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await PostTooltiperAck(windowPath, widgetName, widgetType, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('api/nodes/history/*/*', () => {
  const mockData = ['2023-12-01T10:30:00', '2023-12-31T15:45:00']; // [end, start] - как в коде

  it('status response → 200', async () => {
    const mockResponseData = [
      { timestamp: '2023-12-01T10:30:00', value: 'test1' },
      { timestamp: '2023-12-31T15:45:00', value: 'test2' }
    ];
    
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve(mockResponseData)
    });

    await GetHistoryTime(mockData, callback);

    const expectedUrl = `http://example.com/api/nodes/history/${moment(mockData[1]).format("YYYY-MM-DDTHH:mm:ss")}/${moment(mockData[0]).format("YYYY-MM-DDTHH:mm:ss")}`;
    expect(mockFetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers)
      })
    );

    // Проверяем заголовки
    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.get('Authorization')).toBe('Bearer-ABC123');
    expect(headers.get('Content-Type')).toBeNull(); // Не должно быть Content-Type для GET

    expect(callback).toHaveBeenCalledWith(true, mockResponseData);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve({})
    });

    await GetHistoryTime(mockData, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '401 Bad Request');
    expect(callback).toHaveBeenCalledWith(false, '');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('status response → 500', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({})
    });

    await GetHistoryTime(mockData, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', '500 Internal Server Error');
    expect(callback).toHaveBeenCalledWith(false, '');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('network error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockFetch.mockRejectedValueOnce(error);

    await GetHistoryTime(mockData, callback);

    // expect(store.dispatch).toHaveBeenCalledWith('AddError_action', errorMessage);
    expect(callback).toHaveBeenCalledWith('Истекло время ожидания команды');
    expect(callback).toHaveBeenCalledTimes(1);
  });
})