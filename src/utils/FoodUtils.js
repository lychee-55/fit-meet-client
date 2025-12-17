// src/utils/foodUtils.js

/**
 * '100mL' 또는 '150g'과 같은 servingSizeRaw 문자열에서 숫자와 단위를 추출합니다.
 */
export function parseServingSize(servingSizeRaw) {
  if (!servingSizeRaw) {
    return { amount: 100, unit: 'g' }; // 기본값
  }

  // 숫자와 문자를 분리하는 정규식
  const match = servingSizeRaw.match(/^(\d+(\.\d+)?)\s*([a-zA-Z]+)?$/);

  if (match) {
    const amount = parseFloat(match[1]);
    let unit = match[3] || 'g'; // 단위가 없으면 기본값 'g'

    // ml/g을 통합적으로 처리 (단위는 UI 표시용)
    if (unit.toLowerCase().includes('ml')) {
      unit = 'mL';
    } else if (unit.toLowerCase().includes('g')) {
      unit = 'g';
    } else {
      // 알 수 없는 단위의 경우 기본값 g으로 설정
      unit = 'g';
    }

    return { amount: amount, unit: unit };
  }

  // 파싱 실패 시 기본값
  return { amount: 100, unit: 'g' };
}
