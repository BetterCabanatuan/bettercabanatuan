import { render, type RenderOptions } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import {
  MemoryRouter,
  Route,
  Routes,
  type MemoryRouterProps,
} from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react';

interface RenderWithProvidersOptions extends RenderOptions {
  route?: string;
  routePattern?: string;
  routerProps?: MemoryRouterProps;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/',
    routePattern = '*',
    routerProps,
    ...options
  }: RenderWithProvidersOptions = {}
) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]} {...routerProps}>
        <NuqsAdapter>
          <Routes>
            <Route path={routePattern} element={ui} />
          </Routes>
        </NuqsAdapter>
      </MemoryRouter>
    </HelmetProvider>,
    options
  );
}
