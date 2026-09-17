namespace ExampleApp;

public partial class CalculatorPage : ContentPage
{
    public CalculatorPage()
    {
        InitializeComponent();
    }

    public static double Add(double left, double right) => left + right;

    public static double Divide(double left, double right) =>
        right == 0 ? throw new ArgumentOutOfRangeException(nameof(right), "Cannot divide by zero") : left / right;
}
