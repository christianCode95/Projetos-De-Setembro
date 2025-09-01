document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");
  const dropZone = document.getElementById("form-builder");
  const generateHtmlBtn = document.getElementById("generate-html");
  const generateHtmlOutput = document.getElementById("generate-html-output");
  let draggedElement = null;

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", (e) => {
      draggedElement = e.target;
      e.dataTransfer.setData("text/plain", e.target.dataset.type);
      e.target.classList.add("dragging");
    });
    draggable.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
      draggedElement = null;
    });
  });
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const fieldType = e.dataTransfer.getData("text/plain");
    if (fieldType) {
      const newField = createFormField(fieldType);
      if (newField) {
        dropZone.appendChild(newField);

        newField
          .querySelector(".remove-field")
          .addEventListener("click", () => {
            newField.remove();
          });
      }
    }
  });
  function createFormField(type) {
    const fieldWrapper = document.createElement("div");
    fieldWrapper.classList.add("form-field");
    let htmlContent = "";
    let labelText = "";
    switch (type) {
      case "text":
        labelText = "Campo de Texto";
        htmlContent = `<label>Nome do Campo:</label><input type="text" class="field-label"
                value="Campo de Texto">
                <label>Placehoder:</label><input type="text" class="field-placeholder" value="Digite Algo">`;
        break;
      case "email":
        labelText = "Campo de E-mail";
        htmlContent = `<label>Nome do Campo:</label><input type="text" class="field-label"
                    value="Campo de E-mail">
                    <label>Placeholder:</label>
                    <input type="email" class="field-placeholder" value="email@exemplo.com">`;
        break;
      case "password":
        labelText = "Campo de Senha";
        htmlContent = `<label>Nome do Campo:</label>
                        <input type="text" class="field-label" value="Campo de Senha">
                        <label>Placeholder:</label>
                        <input type="password" class="field-placeholder" value="Sua senha">`;
        break;
      case "number":
        labelText = "Campo Numérico";
        htmlContent = `<label>Nome do Campo:</label>
                            <input type="text" class="field-label" value="Campo Numérico">
                            <label>Placeholder</label>
                            <input type="number" class="field-placeholder" value="123">`;
        break;
      case "select":
        labelText = "Campo de Seleção";
        htmlContent = `<label>Nome do Campo:</label>
                                <input type="text" class="field-label" value="Campo de Seleção">
                                <label>Opções (separadas por vírgula):</label>
                                <input type="text" class="field-options" value="Opção 1, Opção 2">`;
        break;
      case "checkbox":
        labelText = "Caixa de Checagem";
        htmlContent = `<label>Nome do Campo:</label>
                                    <input type="text" class="field-label" value="Caixa de Checagem">`;
        break;
      case "radio":
        labelText = "Botão de Rádio";
        htmlContent = `<label>Nome do Grupo:</label>
                                        <input type="text" class="field-label" value="Grupo de Rádio">
                                        <label>Opções (separadas por vírgula):</label>
                                        <input type="text" class="field-options" value="Opção A, Opção B">`;
        break;
      case "textarea":
        labelText = "Área de Texto";
        htmlContent = `<label>Nome do Campo:</label>
                                            <input type="text" class="field-label" value="Área de Texto">
                                            <label>Placeholder:</label>
                                            <input type="text" class="field-placeholder" value="Sua mensagem">`;
        break;
      default:
        return null;
    }
    fieldWrapper.innerHTML = `${htmlContent} <button class="remove-field">Remover</button>`;
    fieldWrapper.dataset.type = type;
    return fieldWrapper;
  }
  generateHtmlBtn.addEventListener("click", () => {
    let generatedHtml = "<form>\n";
    const formFields = dropZone.querySelectorAll(".form-field");
    formFields.forEach((field) => {
      const type = field.dataset.type;
      const labelInput = field.querySelector(".field-label");
      const placeholderInput = field.querySelector(".field-placeholder");
      const optionsInput = field.querySelector(".field-options");
      const labelValue = labelInput ? labelInput.value : "";
      const placeholderValue = placeholderInput
        ? `placeholder="${placeholderInput.value}"`
        : "";
      const nameAttr = labelValue
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/[^a-z0-9]/g, "");
      switch (type) {
        case "text":
        case "email":
        case "password":
        case "number":
          generatedHtml += `<div>\n
                        <label for="${nameAttr}">${labelValue}:</label>\n <input type="${type}"
                        id="${nameAttr}" name="${nameAttr}" ${placeholderValue}>\n </div>\n`;
          break;
        case "textarea":
          generatedHtml += `<div>\n
                            <label for="${nameAttr}">${labelValue}:</label>\n
                            <textarea id="${nameAttr}" name="${nameAttr}" ${placeholderValue}></textarea>\n </div>\n`;
          break;
        case "select":
          const options = optionsInput
            ? optionsInput.value.split(",").map((opt) => opt.trim())
            : [];
          let optionsHtml = "";
          options.forEach((option) => {
            optionsHtml += `<option value="${option
              .toLowerCase()
              .replace(/\s/g, "-")}">
                                    ${option}</option>\n`;
          });
          generatedHtml += `<div>\n <label for="${nameAttr}"> ${labelValue}:</label>\n <select id="${nameAttr}" name="${nameAttr}">\n${optionsHtml}</select>\n </div>\n`;
          break;
        case "checkbox":
          generatedHtml += `<div>\n
            <input type="checkbox" id="${nameAttr}" name="${nameAttr}">\n <label for="${nameAttr}">${labelValue}</label>\n </div>\n`;
            break;
        case "radio":
          const radioOptions = optionsInput
            ? optionsInput.value.split(",").map((opt) => opt.trim())
            : [];
          let radioHtml = `<div>\n <p>${labelValue}:</p>\n`;
          radioOptions.forEach((option, index) => {
            const radioId = `${nameAttr}-${index}`;
            radioHtml += `<div>\n 
                    <input type="radio" id="${radioId}" name="${nameAttr}" value="${option
              .toLowerCase()
              .replace(/\s/g, "-")}"`;
            if (index === 0) radioHtml += `checked`;
            radioHtml += `>\n <label for="${radioId}"> ${option} </label>\n </div>\n`;
          });
          radioHtml += `<div>\n`;
          generatedHtml += radioHtml;
          break;
      }
    });
    generatedHtml += '<button type="submit">Enviar</button>\n';
    generatedHtml += "</form>";

    generateHtmlOutput.value = generatedHtml;
  });
});
