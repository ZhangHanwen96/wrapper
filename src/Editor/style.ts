export const style = `
:host {
    --badge-bg: #5A67CB;
  }
  
  .mkeditable-wrapper {
    position: relative;
    width: 200px;
    display: flex;
  }

  .status {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--badge-bg);
    padding: 4px 10px;
    border-radius: 10px;
    opacity: 0;
    visibility: hidden;
    transition: 0.2s all cubic-bezier(0.075, 0.82, 0.165, 1);

    line-height: 1.2;
    font-size: 12px;
    font-weight: normal;
    color: white;
    cursor: pointer;
    white-space: nowrap;
  }
  
  /* .hoverActive + .status {
    opacity: 1;
    visibility: visible;
  } */
  
  /* .editingActive + .status {
    opacity: 1;
    visibility: visible;
  } */
  
  [data-mkeditable].isEmpty:not(.editingActive) + .status {
    opacity: 1;
    visibility: visible;
  }
  
  [data-mkeditable].isEmpty:not(.editingActive):hover + .status {
    background-color: black;
    cursor: pointer;
  }
  
  [data-mkeditable].isEmpty:not(.editingActive) + .status:hover {
    background-color: black;
    cursor: pointer;
  }
  
  
  /* test above */
  
  [data-mkeditable] {
    position: relative;
    cursor: text;
    width: 100%;
    /* transition: 1s all cubic-bezier(0.075, 0.82, 0.165, 1); */
  }
  
  div[data-mkeditable] {
    line-height: 35px;
  }
  
  /* remove input default outline */
  [data-mkeditable]:focus {
    outline: none;
  }
  
  [data-mkeditable='button']{
    width: 200px;
    min-height: 35px;
    outline: none;
    border: none;
    border-radius: 5px;
    background-color: rgb(104, 94, 94);
    color: white;
  }
  
  /* mask */
  [data-mkeditable]::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(63, 76, 172, 0.2);
    border: 1px solid #5A67CB;
    /* padding: 4px; */
    margin: -4px;
  
    transition: 0.2s all cubic-bezier(0.075, 0.82, 0.165, 1);
    transform: translate(0, 0);
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  
    line-height: 1.2;
    font-size: 12px;
    font-weight: normal;
  }
  
  /* hide mask */
  [data-mkeditable='button']::before {
    background-color: transparent;
  }
  
  /* status badge */
  [data-mkeditable]::after {
    position: absolute;
    left: -4px;
    top: 0;
    transform: translateY(calc(-100% - 5px));
    background-color: var(--badge-bg);
    padding: 4px;
    border-radius: 2px;
    opacity: 0;
    visibility: hidden;
    transition: 0.2s all cubic-bezier(0.075, 0.82, 0.165, 1);
    pointer-events: none;
  
    
    line-height: 1.2;
    font-size: 12px;
    font-weight: normal;
    color: white;
  }
  
  [data-mkeditable].hoverActive::before {
    opacity: 1;
    visibility: visible;
  }
  
  [data-mkeditable].hoverActive::after {
    content: 'click to edit';
    opacity: 1;
    visibility: visible;
  } 
  
  
  /* Editing */
  [data-mkeditable].editingActive {
    background-color: rgba(169, 226, 147, 0.137);
  }
  
  [data-mkeditable].editingActive::after {
    opacity: 1;
    visibility: visible;
    content: 'Editing';
  } 
  
  [data-mkeditable].editingActive::before {
    opacity: 1;
    visibility: visible;
  }
  
  /* when innerHtml is empty */
  [data-mkeditable].isEmpty:not(.editingActive) {
    height: 4px;
    min-height: 0;
    background: transparent;
    pointer-events: none;
  }
  
  [data-mkeditable].isEmpty:not(.editingActive)::before {
    opacity: 1;
    visibility: visible;
    margin: 0;
    /* background: transparent; */
    background: rgba(90, 103, 203, 0.2);
  }
  
  /* hide mask when editing */
  [data-mkeditable].editingActive::before {
    background-color: transparent;
  }
  
  /* [data-mkeditable].isEmpty:not(.editingActive)::after {
    opacity: 1;
    visibility: visible;
    content: 'Click to edit';
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 10px;
  }
  
  [data-mkeditable].isEmpty:not(.editingActive):hover::after {
    background-color: black;
    cursor: pointer;
  } */
  
  [data-mkeditable].isEmpty:not(.editingActive){
    cursor: pointer;
  }
`;
