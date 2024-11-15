namespace Resume.Models
{
    public class DatabaseSettings
    {
        //internal string CategoriesCollectionName;
        public string? ConnectionString { get; set; }
        public string? DatabaseName { get; set; }
        public string? LoginCollectionName { get; set; }
        public string? UserInfoCollectionName { get; set; }

        //public string? UserDetailCollectionName { get; set; }
    }
}
