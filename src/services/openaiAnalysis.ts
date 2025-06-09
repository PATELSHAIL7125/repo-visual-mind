
export interface OpenAIAnalysisResult {
  architectureInsights: string;
  technologyRecommendations: string[];
  codeQualityScore: number;
  securityConcerns: string[];
  performanceOptimizations: string[];
}

export const analyzeRepositoryWithOpenAI = async (
  repositoryData: any,
  apiKey: string
): Promise<OpenAIAnalysisResult | null> => {
  if (!apiKey || !repositoryData) {
    console.log('Missing API key or repository data for OpenAI analysis');
    return null;
  }

  try {
    const fileStructure = repositoryData.tree?.map((item: any) => ({
      path: item.path,
      type: item.type,
      size: item.size
    })) || [];

    const prompt = `
Analyze this repository structure and provide insights:

Repository Info:
- Name: ${repositoryData.info?.name || 'Unknown'}
- Description: ${repositoryData.info?.description || 'No description'}
- Total Files: ${fileStructure.length}

File Structure (first 50 files):
${fileStructure.slice(0, 50).map(f => `${f.type}: ${f.path}`).join('\n')}

Please provide:
1. Architecture insights and patterns you observe
2. Technology recommendations for improvement
3. Code quality score (1-10)
4. Potential security concerns
5. Performance optimization suggestions

Respond in JSON format with keys: architectureInsights, technologyRecommendations, codeQualityScore, securityConcerns, performanceOptimizations
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a senior software architect analyzing repository structures. Provide detailed, actionable insights in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback parsing if JSON is not wrapped
    return JSON.parse(content);

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return null;
  }
};
