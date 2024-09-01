  <script>
    export let backgroundImage;
    export let position = 'right';
    export let title = 'Default Title';
    export let description = 'This is the default description';
    export let buttonName = 'Button';
    export let routerPath;
    
  </script>
  
  <section class="page-content" style="background-image: url({backgroundImage}">
    <div>
      <div class:container={true} class:right={position === 'right'} class:left={position === 'left'}>
        <h2>{title}</h2>
        <p>{description}</p>
        {#if routerPath}
          <p><a href={routerPath} class="button white border">{buttonName}</a></p>
        {/if}
      </div>
    </div>
  </section>
  
  <style lang="scss">
    @import "src/lib/styles/section.scss";
  </style>
  