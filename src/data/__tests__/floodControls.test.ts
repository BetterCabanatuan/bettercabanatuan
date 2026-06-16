import { describe, expect, it } from 'vitest';
import { allFloodControlProjects, floodControlsData } from '../yamlLoader';

describe('flood controls data', () => {
  it('loads featured flood control projects', () => {
    expect(floodControlsData.title).toBeTruthy();
    expect(allFloodControlProjects).toHaveLength(9);
  });

  it('includes required project fields', () => {
    const project = allFloodControlProjects[0];
    expect(project).toMatchObject({
      slug: expect.any(String),
      title: expect.any(String),
      contractor: expect.any(String),
      cost: expect.stringMatching(/^PHP /),
      completionDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });
});
