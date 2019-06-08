export default (color: string) => {
  document.querySelector('#theme-color')!.setAttribute('content', color)
}