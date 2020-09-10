class alert extends HTMLElement {
  constructor() {
    super();
  }

  set content(content) {
    /* 
      // content structure
      {
        color: color,
        html: HTMLstring,
        close: boolean
      }
    */

    let close = content.close ? `
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    ` : '';

    this.innerHTML = `
    <!-- Alert Area Start -->
    <div class="alert alert-${content.color} alert-dismissible fade show" role="alert">
      ${content.html}
      ${close}
    </div>
    <!-- Alert Area End -->
    `;
  }
}

customElements.define("alert-dialog", alert);
