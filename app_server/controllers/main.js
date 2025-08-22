/* Get Homepage */
const index = (req, res) => {
    red.render('index', { title: "Travlr Getaways" });
};

module.exports = {
    index
}