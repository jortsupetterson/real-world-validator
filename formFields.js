/**
 * @preserve
 * @function getFormField
 * @param {string} fieldId
 * @param {string} fieldType
 * @param {string} fieldName
 * @param {string} value
 * @param {string} placeholder
 * @returns {string} - HTML litelar
 */

export default async function getFormField(
  fieldId,
  fieldType,
  fieldName,
  value = "",
  placeholder = ""
) {
  return `
    <div class="column transparent">
        <div id="${`${fieldName}-label`}" class="row transparent">
        <label id="${`${fieldName}-label`}" for="${fieldId}"></label>
        <input id="${fieldId}" type="${fieldType}" name="${fieldName}" value="${value}" placeholder="${placeholder}">
        </div>
        <outputid="${`${fieldName}-output`}" for="${fieldId}"></output>
    </div>
    `;
}
