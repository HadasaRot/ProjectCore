using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace ProjectCore.Utilities
{
    public static class FileHelper<T> where T : class
    {
        private static string GetFilePath()
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "Data", $"{typeof(T).Name.ToLower()}s.json");

        }

        public static List<T> ReadFromJson()
        {
            var filePath = GetFilePath();

            if (!File.Exists(filePath))
            {
                File.WriteAllText(filePath, "[]");
                return new List<T>();
            }

            var json = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
        }

        public static void WriteToJson(List<T> items)
        {
            var filePath = GetFilePath();
            var json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, json);
        }
    }
}

