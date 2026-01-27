import { http, HttpResponse } from 'msw';

// Mock API handlers for testing
// Add your API endpoints here to mock them during tests

export const handlers = [
  // Example: Mock a GET request
  // http.get('/api/users', () => {
  //   return HttpResponse.json([
  //     { id: '1', name: 'John Doe' },
  //     { id: '2', name: 'Jane Smith' },
  //   ]);
  // }),

  // Example: Mock a POST request
  // http.post('/api/users', async ({ request }) => {
  //   const body = await request.json();
  //   return HttpResponse.json({ id: '1', ...body }, { status: 201 });
  // }),
];
